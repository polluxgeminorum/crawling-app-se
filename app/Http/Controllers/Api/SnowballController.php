<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogActivity;
use App\Models\Snowball;
use App\Models\Crowdlisting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SnowballController extends Controller
{
    /**
     * Store a new snowball entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'nama_pengisi' => 'required|string|max:255',
            'no_telp' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'kabupaten_kota' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $snowball = Snowball::create([
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'nama_pengisi' => $request->nama_pengisi,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'link_toko_online' => $request->link_toko_online,
            'kabupaten_kota' => $request->kabupaten_kota,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menambahkan data snowball: ' . $snowball->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data snowball berhasil disimpan',
            'data' => $snowball,
        ], 201);
    }

    /**
     * Get all snowball entries
     */
    public function index(Request $request)
    {
        $snowball = Snowball::with(['creator', 'updater'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $snowball,
        ]);
    }

    /**
     * Get a single snowball entry
     */
    public function show(Request $request, $id)
    {
        $snowball = Snowball::with(['creator', 'updater'])->find($id);

        if (!$snowball) {
            return response()->json([
                'success' => false,
                'message' => 'Data snowball tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $snowball,
        ]);
    }

    /**
     * Update a snowball entry
     */
    public function update(Request $request, $id)
    {
        $snowball = Snowball::find($id);

        if (!$snowball) {
            return response()->json([
                'success' => false,
                'message' => 'Data snowball tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'nama_pengisi' => 'required|string|max:255',
            'no_telp' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'link_toko_online' => 'nullable|string|max:255',
            'kabupaten_kota' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $snowball->update([
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'nama_pengisi' => $request->nama_pengisi,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'link_toko_online' => $request->link_toko_online,
            'kabupaten_kota' => $request->kabupaten_kota,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Mengupdate data snowball: ' . $snowball->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data snowball berhasil diperbarui',
            'data' => $snowball,
        ]);
    }

    /**
     * Delete a snowball entry
     */
    public function destroy(Request $request, $id)
    {
        $snowball = Snowball::find($id);

        if (!$snowball) {
            return response()->json([
                'success' => false,
                'message' => 'Data snowball tidak ditemukan',
            ], 404);
        }

        $user = $request->user();
        $nama = $snowball->nama_keluarga_bangunan_usaha;

        // Log activity before delete
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menghapus data snowball: ' . $nama,
            'timestamp' => now(),
        ]);

        $snowball->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data snowball berhasil dihapus',
        ]);
    }

    /**
     * Sync is_input status for all snowball entries
     */
    public function sync(Request $request)
    {
        $user = $request->user();
        $snowballData = Snowball::all();
        $updatedCount = 0;

        foreach ($snowballData as $snowball) {
            // Check if email or no_telp exists in crowdlisting
            $existsInCrowdlisting = Crowdlisting::where(function($query) use ($snowball) {
                    if ($snowball->email) {
                        $query->orWhere('email', $snowball->email);
                    }
                    if ($snowball->no_telp) {
                        $query->orWhere('no_telp', $snowball->no_telp);
                    }
                })->exists();

            $snowball->update([
                'is_input' => $existsInCrowdlisting ? 1 : 0
            ]);

            if ($existsInCrowdlisting) {
                $updatedCount++;
            }
        }

        // Log activity for sync
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Sinkronisasi data snowball: ' . $updatedCount . ' data ditemukan di crowdlisting',
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sinkronisasi berhasil. ' . $updatedCount . ' data snowball ditemukan di crowdlisting.',
        ]);
    }

    /**
     * Get activity logs
     */
    public function logs(Request $request)
    {
        $user = $request->user();

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Melihat log aktivitas',
            'timestamp' => now(),
        ]);

        $logs = LogActivity::orderBy('timestamp', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
