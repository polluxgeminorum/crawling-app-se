<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DigitalTracing;
use App\Models\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DigitalTracingController extends Controller
{
    /**
     * Store a new digital tracing entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'link' => 'nullable|string|max:500',
            'nama_usaha' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'jenis_platform' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $digitalTracing = DigitalTracing::create([
            'link' => $request->link,
            'nama_usaha' => $request->nama_usaha,
            'kategori' => $request->kategori,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
            'jenis_platform' => $request->jenis_platform,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menambahkan data digital tracing: ' . $digitalTracing->nama_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data digital tracing berhasil disimpan',
            'data' => $digitalTracing,
        ], 201);
    }

    /**
     * Get all digital tracing entries
     */
    public function index(Request $request)
    {
        $digitalTracing = DigitalTracing::with(['creator', 'updater'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $digitalTracing,
        ]);
    }

    /**
     * Get a single digital tracing entry
     */
    public function show(Request $request, $id)
    {
        $digitalTracing = DigitalTracing::with(['creator', 'updater'])->find($id);

        if (!$digitalTracing) {
            return response()->json([
                'success' => false,
                'message' => 'Data digital tracing tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $digitalTracing,
        ]);
    }

    /**
     * Update a digital tracing entry
     */
    public function update(Request $request, $id)
    {
        $digitalTracing = DigitalTracing::find($id);

        if (!$digitalTracing) {
            return response()->json([
                'success' => false,
                'message' => 'Data digital tracing tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'link' => 'nullable|string|max:500',
            'nama_usaha' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'jenis_platform' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $digitalTracing->update([
            'link' => $request->link,
            'nama_usaha' => $request->nama_usaha,
            'kategori' => $request->kategori,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
            'jenis_platform' => $request->jenis_platform,
            'updated_by' => $user->id,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Memperbarui data digital tracing: ' . $digitalTracing->nama_usaha,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data digital tracing berhasil diperbarui',
            'data' => $digitalTracing,
        ]);
    }

    /**
     * Delete a digital tracing entry
     */
    public function destroy(Request $request, $id)
    {
        $digitalTracing = DigitalTracing::find($id);

        if (!$digitalTracing) {
            return response()->json([
                'success' => false,
                'message' => 'Data digital tracing tidak ditemukan',
            ], 404);
        }

        $user = $request->user();

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Menghapus data digital tracing: ' . $digitalTracing->nama_usaha,
            'timestamp' => now(),
        ]);

        $digitalTracing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data digital tracing berhasil dihapus',
        ]);
    }

    /**
     * Import digital tracing from xlsx file
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $user = $request->user();
        
        $file = $request->file('file');
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        
        $rowCount = 0;
        $importedCount = 0;
        
        foreach ($sheet->getRowIterator() as $row) {
            // Skip header row
            if ($rowCount == 0) {
                $rowCount++;
                continue;
            }
            
            $cells = $row->getCellIterator();
            $cells->setIterateOnlyExistingCells(false);
            
            $rowData = [];
            foreach ($cells as $cell) {
                $rowData[] = $cell->getValue();
            }
            
            // Map columns: link, nama_usaha, kategori, alamat, no_telp, jenis_platform
            if (isset($rowData[1]) && !empty($rowData[1])) {
                DigitalTracing::create([
                    'link' => $rowData[0] ?? null,
                    'nama_usaha' => $rowData[1],
                    'kategori' => $rowData[2] ?? null,
                    'alamat' => $rowData[3] ?? null,
                    'no_telp' => $rowData[4] ?? null,
                    'jenis_platform' => $rowData[5] ?? null,
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                ]);
                $importedCount++;
            }
            
            $rowCount++;
        }

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'Mengimpor ' . $importedCount . ' data digital tracing dari Excel',
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengimpor ' . $importedCount . ' data digital tracing',
            'data' => [
                'imported_count' => $importedCount,
            ],
        ]);
    }
}
