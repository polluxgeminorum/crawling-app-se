<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dtsen;
use App\Models\Crowdlisting;
use App\Models\Snowball;
use App\Models\DigitalTracing;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and chart data
     */
    public function index(Request $request)
    {
        // Get counts for each table
        $dtsenCount = Dtsen::count();
        $crowdlistingCount = Crowdlisting::count();
        $digitalTracingCount = DigitalTracing::count();
        $snowballCount = Snowball::count();

        // Get all data for charts
        $dtsenData = Dtsen::all();
        $crowdlistingData = Crowdlisting::all();
        $snowballData = Snowball::all();

        // Process jenis_usaha for pie chart (combining DTSEN and Crowdlisting)
        $jenisUsahaCounts = [];

        foreach ($dtsenData as $item) {
            $jenis = $item->jenis_usaha ?: 'Tidak Diketahui';
            if (!isset($jenisUsahaCounts[$jenis])) {
                $jenisUsahaCounts[$jenis] = 0;
            }
            $jenisUsahaCounts[$jenis]++;
        }

        foreach ($crowdlistingData as $item) {
            $jenis = $item->jenis_usaha ?: 'Tidak Diketahui';
            if (!isset($jenisUsahaCounts[$jenis])) {
                $jenisUsahaCounts[$jenis] = 0;
            }
            $jenisUsahaCounts[$jenis]++;
        }

        // Process platform for bar chart
        $platformCounts = [];

        foreach ($dtsenData as $item) {
            $platform = $item->jenis_platform ?: 'Tidak Diketahui';
            if (!isset($platformCounts[$platform])) {
                $platformCounts[$platform] = 0;
            }
            $platformCounts[$platform]++;
        }

        foreach ($crowdlistingData as $item) {
            $platform = $item->platform_digital ?: 'Tidak Diketahui';
            if (!isset($platformCounts[$platform])) {
                $platformCounts[$platform] = 0;
            }
            $platformCounts[$platform]++;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'counts' => [
                    'dtsen' => $dtsenCount,
                    'crowdlisting' => $crowdlistingCount,
                    'digital_tracing' => $digitalTracingCount,
                    'snowball' => $snowballCount,
                    'total' => $dtsenCount + $crowdlistingCount + $digitalTracingCount + $snowballCount,
                ],
                'jenis_usaha' => array_map(function($key, $value) {
                    return ['name' => $key, 'value' => $value];
                }, array_keys($jenisUsahaCounts), array_values($jenisUsahaCounts)),
                'platform' => array_map(function($key, $value) {
                    return ['name' => $key, 'value' => $value];
                }, array_keys($platformCounts), array_values($platformCounts)),
            ],
        ]);
    }

    /**
     * Get statistics per kabupaten/kota
     */
    public function statistikKabupatenKota(Request $request)
    {
        // List of 15 kab/kot in Lampung
        $kabupatenKotaList = [
            'Lampung Barat',
            'Tanggamus',
            'Lampung Selatan',
            'Lampung Timur',
            'Lampung Tengah',
            'Lampung Utara',
            'Way Kanan',
            'Tulang Bawang',
            'Pesawaran',
            'Pringsewu',
            'Mesuji',
            'Tulang Bawang Barat',
            'Pesisir Barat',
            'Kota Bandar Lampung',
            'Kota Metro'
        ];

        $result = [];

        foreach ($kabupatenKotaList as $kabKota) {
            // Count from each table
            $dtsenCount = Dtsen::where('kabupaten_kota', $kabKota)->count();
            $crowdlistingCount = Crowdlisting::where('kabupaten_kota', $kabKota)->count();
            $snowballCount = Snowball::where('kabupaten_kota', $kabKota)->count();
            $total = $dtsenCount + $crowdlistingCount + $snowballCount;

            $result[] = [
                'nama' => $kabKota,
                'dtsen' => $dtsenCount,
                'crowdlisting' => $crowdlistingCount,
                'snowball' => $snowballCount,
                'total' => $total,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
