<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = LogActivity::query()->orderBy('timestamp', 'desc');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('activity_log', 'like', "%{$search}%");
            });
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('timestamp', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('timestamp', '<=', $request->end_date);
        }

        $data = $query->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'last_page' => $data->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_log' => 'required|string',
        ]);

        $user = Auth::user();

        $logActivity = LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => $validated['activity_log'],
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $logActivity,
            'message' => 'Activity log created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $logActivity = LogActivity::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $logActivity
        ]);
    }

    /**
     * Get activity statistics.
     */
    public function statistics()
    {
        $totalActivities = LogActivity::count();
        
        $todayActivities = LogActivity::whereDate('timestamp', today())->count();
        
        $weekActivities = LogActivity::whereBetween('timestamp', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ])->count();

        $monthActivities = LogActivity::whereMonth('timestamp', now()->month)
            ->whereYear('timestamp', now()->year)
            ->count();

        // Recent activities (last 10)
        $recentActivities = LogActivity::orderBy('timestamp', 'desc')
            ->limit(10)
            ->get();

        // Activities by user
        $activitiesByUser = LogActivity::selectRaw('name, COUNT(*) as count')
            ->groupBy('name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Activities by role (join with users table)
        $activitiesByRole = LogActivity::selectRaw('users.role, COUNT(*) as count')
            ->join('users', 'log_activities.email', '=', 'users.email')
            ->groupBy('users.role')
            ->orderByDesc('count')
            ->get();

        // Daily activities for the last 7 days
        $dailyActivities = [];
        $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = LogActivity::whereDate('timestamp', $date)->count();
            $dailyActivities[] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => $dayNames[$date->dayOfWeek],
                'count' => $count
            ];
        }

        // Activities by hour (today)
        $hourlyActivities = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $count = LogActivity::whereDate('timestamp', today())
                ->whereRaw('HOUR(timestamp) = ?', [$hour])
                ->count();
            $hourlyActivities[] = [
                'hour' => $hour,
                'label' => sprintf('%02d:00', $hour),
                'count' => $count
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_activities' => $totalActivities,
                'today_activities' => $todayActivities,
                'week_activities' => $weekActivities,
                'month_activities' => $monthActivities,
                'recent_activities' => $recentActivities,
                'activities_by_user' => $activitiesByUser,
                'activities_by_role' => $activitiesByRole,
                'daily_activities' => $dailyActivities,
                'hourly_activities' => $hourlyActivities,
            ]
        ]);
    }
}
