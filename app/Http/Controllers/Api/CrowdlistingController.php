<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogActivity;
use App\Models\Crowdlisting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CrowdlistingController extends Controller
{
    /**
     * Store a new crowdlisting entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'jenis_usaha' => 'required|string|max:255',
            'alamat' => 'required|string',
            'jumlah_usaha' => 'required|integer|min:1',
            'kode_pos' => 'nullable|string|max:10',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string|max:20',
            'kabupaten_kota' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $crowdlisting = Crowdlisting::create([
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'nama_pemilik' => $request->nama_pemilik,
            'jenis_usaha' => $request->jenis_usaha,
            'platform_digital' => $request->platform_digital,
            'alamat' => $request->alamat,
            'jumlah_usaha' => $request->jumlah_usaha,
            'kode_pos' => $request->kode_pos,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'kabupaten_kota' => $request->kabupaten_kota,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menambahkan data crowdlisting: ' . $crowdlisting->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data crowdlisting berhasil disimpan',
            'data' => $crowdlisting,
        ], 201);
    }

    /**
     * Get all crowdlisting entries
     */
    public function index(Request $request)
    {
        $crowdlisting = Crowdlisting::with(['creator', 'updater'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $crowdlisting,
        ]);
    }

    /**
     * Get a single crowdlisting entry
     */
    public function show(Request $request, $id)
    {
        $crowdlisting = Crowdlisting::with(['creator', 'updater'])->find($id);

        if (!$crowdlisting) {
            return response()->json([
                'success' => false,
                'message' => 'Data crowdlisting tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $crowdlisting,
        ]);
    }

    /**
     * Update a crowdlisting entry
     */
    public function update(Request $request, $id)
    {
        $crowdlisting = Crowdlisting::find($id);

        if (!$crowdlisting) {
            return response()->json([
                'success' => false,
                'message' => 'Data crowdlisting tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'jenis_usaha' => 'required|string|max:255',
            'alamat' => 'required|string',
            'jumlah_usaha' => 'required|integer|min:1',
            'kode_pos' => 'nullable|string|max:10',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string|max:20',
            'kabupaten_kota' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $crowdlisting->update([
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'nama_pemilik' => $request->nama_pemilik,
            'jenis_usaha' => $request->jenis_usaha,
            'platform_digital' => $request->platform_digital,
            'alamat' => $request->alamat,
            'jumlah_usaha' => $request->jumlah_usaha,
            'kode_pos' => $request->kode_pos,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'kabupaten_kota' => $request->kabupaten_kota,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Mengupdate data crowdlisting: ' . $crowdlisting->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data crowdlisting berhasil diperbarui',
            'data' => $crowdlisting,
        ]);
    }

    /**
     * Delete a crowdlisting entry
     */
    public function destroy(Request $request, $id)
    {
        $crowdlisting = Crowdlisting::find($id);

        if (!$crowdlisting) {
            return response()->json([
                'success' => false,
                'message' => 'Data crowdlisting tidak ditemukan',
            ], 404);
        }

        $user = $request->user();
        $nama = $crowdlisting->nama_keluarga_bangunan_usaha;

        // Log activity before delete
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menghapus data crowdlisting: ' . $nama,
            'timestamp' => now(),
        ]);

        $crowdlisting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data crowdlisting berhasil dihapus',
        ]);
    }
}
