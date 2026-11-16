<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeeCategory;
use App\Models\FeeStructure;
use App\Models\StudentFee;
use App\Models\FeePayment;
use App\Models\Student;
use App\Models\Class as AcademicClass;
use Illuminate\Support\Facades\DB;

class FeeController extends Controller
{
    /**
     * Get upcoming fees (Simplified for dashboard)
     */
    public function upcoming(Request $request)
    {
        $upcoming = StudentFee::with('student')->whereIn('status', ['pending', 'overdue'])->limit(10)->get();
        
        $mapped = $upcoming->map(function($fee) {
            return [
                'id' => $fee->id,
                'studentName' => $fee->student->first_name . ' ' . $fee->student->last_name,
                'amount' => $fee->final_amount - $fee->paid_amount,
                'dueDate' => $fee->due_date,
                'status' => $fee->status
            ];
        });

        return response()->json($mapped);
    }

    /**
     * Search fee account by student admission number or name
     */
    public function search(Request $request)
    {
        $query = $request->query('query');
        
        if (!$query) {
            return response()->json(['message' => 'Query required'], 400);
        }

        $student = Student::with(['class', 'section', 'guardian', 'fees.feeStructure.feeCategory', 'feePayments'])
            ->where('admission_number', $query)
            ->orWhere('first_name', 'like', "%{$query}%")
            ->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $feeHeads = [];
        $totalBalance = 0;

        foreach ($student->fees as $fee) {
            $balance = $fee->final_amount - $fee->paid_amount;
            $totalBalance += $balance;

            $feeHeads[] = [
                'id' => $fee->id, // Passing StudentFee ID as the head ID
                'name' => $fee->feeStructure->feeCategory->name,
                'due' => $fee->final_amount,
                'paid' => $fee->paid_amount,
                'balance' => $balance
            ];
        }

        $recentActivity = $student->feePayments()->orderBy('payment_date', 'desc')->limit(5)->get()->map(function($payment) {
            return [
                'date' => $payment->payment_date,
                'type' => 'Fee Payment', // Simplified
                'amount' => $payment->amount,
                'method' => $payment->payment_mode
            ];
        });

        return response()->json([
            'name' => $student->first_name . ' ' . $student->last_name,
            'admissionNo' => $student->admission_number,
            'class' => $student->class?->name . ' - ' . $student->section?->name,
            'parent' => $student->guardian?->father_name ?? 'N/A',
            'photo' => substr($student->first_name, 0, 1) . substr($student->last_name, 0, 1),
            'totalBalance' => $totalBalance,
            'feeHeads' => $feeHeads,
            'recentActivity' => $recentActivity
        ]);
    }

    /**
     * Record a fee deposit
     */
    public function deposit(Request $request)
    {
        $request->validate([
            'admissionNo' => 'required',
            'amounts' => 'required|array', // key: StudentFee ID, value: amount to pay
            'method' => 'required|string'
        ]);

        $student = Student::where('admission_number', $request->admissionNo)->firstOrFail();

        DB::beginTransaction();

        try {
            $totalPaid = 0;
            $receiptNo = 'RCP' . time() . rand(10, 99);

            foreach ($request->amounts as $feeId => $amount) {
                if ($amount <= 0) continue;

                $studentFee = StudentFee::where('id', $feeId)->where('student_id', $student->id)->firstOrFail();
                $studentFee->paid_amount += $amount;
                
                if ($studentFee->paid_amount >= $studentFee->final_amount) {
                    $studentFee->status = 'paid';
                }
                $studentFee->save();

                $totalPaid += $amount;
            }

            if ($totalPaid > 0) {
                FeePayment::create([
                    'student_id' => $student->id,
                    'receipt_no' => $receiptNo,
                    'payment_date' => now(),
                    'amount' => $totalPaid,
                    'payment_mode' => $request->method,
                    'collected_by' => 1 // hardcoded admin for now
                ]);
            }

            DB::commit();

            return response()->json([
                'receiptId' => $receiptNo,
                'message' => 'Deposit successful and receipt generated.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Payment failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get Fee Structure by Class
     */
    public function structure()
    {
        $classes = AcademicClass::all();
        // Simplified approach: returning a generic structure for classes just for UI mock mapping
        // In real life, we would join class with fee_structures and group by fee_category.
        $result = [];
        foreach ($classes as $cls) {
            $result[] = [
                'grade' => $cls->name,
                'baseTuition' => 5000, // Dummy
                'transportBase' => 1200, // Dummy
                'admissionFee' => 15000, // Dummy
                'examFees' => 2000 // Dummy
            ];
        }

        return response()->json($result);
    }
}
