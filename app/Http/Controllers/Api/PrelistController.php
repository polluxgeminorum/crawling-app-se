<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogActivity;
use App\Models\Prelist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrelistController extends Controller
{
    /**
     * Store a new prelist entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'no_urut_bangunan' => 'required|string|max:255',
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'jenis_usaha' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_urut_keluarga' => 'required|string|max:255',
            'jumlah_usaha' => 'required|integer|min:1',
            'kode_pos' => 'nullable|string|max:10',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $prelist = Prelist::create([
            'no_urut_bangunan' => $request->no_urut_bangunan,
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'jenis_usaha' => $request->jenis_usaha,
            'alamat' => $request->alamat,
            'no_urut_keluarga' => $request->no_urut_keluarga,
            'jumlah_usaha' => $request->jumlah_usaha,
            'kode_pos' => $request->kode_pos,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menambahkan data prelist: ' . $prelist->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data prelist berhasil disimpan',
            'data' => $prelist,
        ], 201);
    }

    /**
     * Get all prelist entries
     */
    public function index(Request $request)
    {
        $prelist = Prelist::with(['creator', 'updater'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $prelist,
        ]);
    }

    /**
     * Get a single prelist entry
     */
    public function show(Request $request, $id)
    {
        $prelist = Prelist::with(['creator', 'updater'])->find($id);

        if (!$prelist) {
            return response()->json([
                'success' => false,
                'message' => 'Data prelist tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $prelist,
        ]);
    }

    /**
     * Update a prelist entry
     */
    public function update(Request $request, $id)
    {
        $prelist = Prelist::find($id);

        if (!$prelist) {
            return response()->json([
                'success' => false,
                'message' => 'Data prelist tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'no_urut_bangunan' => 'required|string|max:255',
            'nama_keluarga_bangunan_usaha' => 'required|string|max:255',
            'jenis_usaha' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_urut_keluarga' => 'required|string|max:255',
            'jumlah_usaha' => 'required|integer|min:1',
            'kode_pos' => 'nullable|string|max:10',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $prelist->update([
            'no_urut_bangunan' => $request->no_urut_bangunan,
            'nama_keluarga_bangunan_usaha' => $request->nama_keluarga_bangunan_usaha,
            'jenis_usaha' => $request->jenis_usaha,
            'alamat' => $request->alamat,
            'no_urut_keluarga' => $request->no_urut_keluarga,
            'jumlah_usaha' => $request->jumlah_usaha,
            'kode_pos' => $request->kode_pos,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Mengupdate data prelist: ' . $prelist->nama_keluarga_bangunan_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data prelist berhasil diperbarui',
            'data' => $prelist,
        ]);
    }

    /**
     * Delete a prelist entry
     */
    public function destroy(Request $request, $id)
    {
        $prelist = Prelist::find($id);

        if (!$prelist) {
            return response()->json([
                'success' => false,
                'message' => 'Data prelist tidak ditemukan',
            ], 404);
        }

        $user = $request->user();
        $nama = $prelist->nama_keluarga_bangunan_usaha;

        // Log activity before delete
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menghapus data prelist: ' . $nama,
            'timestamp' => now(),
        ]);

        $prelist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data prelist berhasil dihapus',
        ]);
    }
}
