<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DropSessionsTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:drop-sessions-table';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            \DB::statement('DROP TABLE IF EXISTS sessions');
            $this->info('Sessions table dropped successfully.');
        } catch (\Exception $e) {
            $this->error('Error dropping sessions table: ' . $e->getMessage());
        }
    }
}
