<?php

namespace Database\Seeders;

use App\Models\DigitalTracing;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DigitalTracingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('digital_tracing.xlsx');

        if (!file_exists($filePath)) {
            $this->command->error("File not found: $filePath");
            return;
        }

        $spreadsheet = IOFactory::load($filePath);
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
                ]);
                $importedCount++;
            }
            
            $rowCount++;
        }

        $this->command->info("Berhasil mengimpor $importedCount data digital tracing");
    }
}
