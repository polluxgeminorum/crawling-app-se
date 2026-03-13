<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dtsen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DtsenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dtsen = Dtsen::with('creator')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $dtsen
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|max:20',
            'jenis_usaha' => 'required|string|max:100',
            'jenis_platform' => 'nullable|string|max:100',
            'kabupaten_kota' => 'nullable|string|max:100',
            'usaha_utama' => 'required|in:Ya,Tidak',
        ]);

        $validated['created_by'] = Auth::id();

        $dtsen = Dtsen::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data DTSEN berhasil ditambahkan',
            'data' => $dtsen
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $dtsen = Dtsen::with('creator')->find($id);

        if (!$dtsen) {
            return response()->json([
                'success' => false,
                'message' => 'Data DTSEN tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $dtsen
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dtsen = Dtsen::find($id);

        if (!$dtsen) {
            return response()->json([
                'success' => false,
                'message' => 'Data DTSEN tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'no_kk' => 'required|string|max:20',
            'jenis_usaha' => 'required|string|max:100',
            'jenis_platform' => 'nullable|string|max:100',
            'kabupaten_kota' => 'nullable|string|max:100',
            'usaha_utama' => 'required|in:Ya,Tidak',
        ]);

        $dtsen->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data DTSEN berhasil diperbarui',
            'data' => $dtsen
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $dtsen = Dtsen::find($id);

        if (!$dtsen) {
            return response()->json([
                'success' => false,
                'message' => 'Data DTSEN tidak ditemukan'
            ], 404);
        }

        $dtsen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data DTSEN berhasil dihapus'
        ]);
    }
}
