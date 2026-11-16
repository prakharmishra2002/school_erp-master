# 💰 Module 08: Fee Management

> **Priority**: 🟡 High  
> **Dependencies**: Students  
> **Phase**: 4 (Financial Modules)  
> **Duration**: Week 13-16

---

## 📋 Overview

Fee management handles the complete financial cycle: fee structure definition, collection, receipts, discounts, and payment gateway integration for online payments.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Fee Structure | Class-wise fee templates | 🔴 Critical |
| Fee Collection | Multi-mode payments | 🔴 Critical |
| Receipt Generation | PDF receipts | 🔴 Critical |
| Online Payments | Razorpay integration | 🟡 High |
| Scholarships | Discount management | 🟡 High |
| Late Fees | Auto calculation | 🟢 Medium |
| Fee Reminders | SMS/Email alerts | 🟢 Medium |
| Outstanding Reports | Defaulters list | 🟡 High |

---

## 🗄️ Database Schema

### Table: `fee_categories`
```sql
CREATE TABLE fee_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Tuition', 'Transport', 'Lab'
    code VARCHAR(20) UNIQUE,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `fee_structures`
```sql
CREATE TABLE fee_structures (
    id BIGSERIAL PRIMARY KEY,
    academic_year_id BIGINT REFERENCES academic_years(id),
    class_id BIGINT REFERENCES classes(id),
    fee_category_id BIGINT REFERENCES fee_categories(id),
    amount DECIMAL(10, 2) NOT NULL,
    frequency ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time') DEFAULT 'monthly',
    due_date INT, -- Day of month (1-28)
    late_fee_per_day DECIMAL(8, 2) DEFAULT 0,
    max_late_fee DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(academic_year_id, class_id, fee_category_id)
);
```

### Table: `student_fees`
```sql
CREATE TABLE student_fees (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id BIGINT REFERENCES fee_structures(id),
    period_start DATE NOT NULL, -- 'Jan 2026'
    period_end DATE NOT NULL,
    
    -- Amounts
    base_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    late_fee_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL, -- base - discount + late
    
    -- Status
    status ENUM('pending', 'partial', 'paid', 'waived') DEFAULT 'pending',
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_date DATE NOT NULL,
    
    -- Discount reference
    discount_id BIGINT REFERENCES discounts(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_fees_student ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);
CREATE INDEX idx_student_fees_due ON student_fees(due_date);
```

### Table: `fee_payments`
```sql
CREATE TABLE fee_payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode ENUM('cash', 'card', 'upi', 'bank_transfer', 'online', 'cheque') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Transaction info
    transaction_id VARCHAR(100), -- For online/card payments
    bank_name VARCHAR(100),
    cheque_number VARCHAR(50),
    cheque_date DATE,
    
    -- Status
    status ENUM('success', 'pending', 'failed', 'refunded') DEFAULT 'success',
    
    -- Collected by
    collected_by BIGINT REFERENCES users(id),
    remarks TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fee_payments_receipt ON fee_payments(receipt_no);
CREATE INDEX idx_fee_payments_date ON fee_payments(payment_date);
```

### Table: `fee_payment_items`
```sql
CREATE TABLE fee_payment_items (
    id BIGSERIAL PRIMARY KEY,
    fee_payment_id BIGINT REFERENCES fee_payments(id) ON DELETE CASCADE,
    student_fee_id BIGINT REFERENCES student_fees(id),
    amount DECIMAL(10, 2) NOT NULL
);
```

### Table: `discounts`
```sql
CREATE TABLE discounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Sibling Discount', 'Merit Scholarship'
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10, 2) NOT NULL, -- 10 for 10% or 1000 for ₹1000
    applicable_to ENUM('all', 'category', 'class') DEFAULT 'all',
    category_id BIGINT REFERENCES fee_categories(id),
    class_id BIGINT REFERENCES classes(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Fee Structure
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fee-structures` | List fee structures |
| POST | `/api/fee-structures` | Create fee structure |
| PUT | `/api/fee-structures/{id}` | Update fee structure |
| POST | `/api/fee-structures/generate` | Generate student fees |

### Fee Collection
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/{id}/fees` | Get student fee status |
| POST | `/api/fee-payments` | Record payment |
| GET | `/api/fee-payments/{id}/receipt` | Download receipt |
| POST | `/api/fee-payments/online/initiate` | Start online payment |
| POST | `/api/fee-payments/online/verify` | Verify online payment |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/collection` | Daily/monthly collection |
| GET | `/api/reports/outstanding` | Pending dues |
| GET | `/api/reports/defaulters` | Defaulters list |

---

## 🖥️ Backend Implementation

### Fee Collection Service
```php
<?php

namespace App\Services;

use App\Models\FeePayment;
use App\Models\StudentFee;
use Barryvdh\DomPDF\Facade\Pdf;

class FeeCollectionService
{
    public function collectFee(array $data): FeePayment
    {
        // Generate receipt number
        $receiptNo = $this->generateReceiptNo();

        // Create payment record
        $payment = FeePayment::create([
            'student_id' => $data['student_id'],
            'receipt_no' => $receiptNo,
            'amount' => $data['amount'],
            'payment_mode' => $data['payment_mode'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'cheque_number' => $data['cheque_number'] ?? null,
            'cheque_date' => $data['cheque_date'] ?? null,
            'collected_by' => auth()->id(),
            'remarks' => $data['remarks'] ?? null,
        ]);

        // Update student fees
        $remainingAmount = $data['amount'];
        foreach ($data['fee_ids'] as $feeId) {
            $studentFee = StudentFee::find($feeId);
            $pending = $studentFee->final_amount - $studentFee->paid_amount;
            
            if ($remainingAmount <= 0) break;
            
            $payAmount = min($pending, $remainingAmount);
            
            $payment->items()->create([
                'student_fee_id' => $feeId,
                'amount' => $payAmount,
            ]);
            
            $studentFee->paid_amount += $payAmount;
            $studentFee->status = $studentFee->paid_amount >= $studentFee->final_amount 
                ? 'paid' 
                : 'partial';
            $studentFee->save();
            
            $remainingAmount -= $payAmount;
        }

        return $payment;
    }

    public function generateReceipt(FeePayment $payment): string
    {
        $payment->load(['student.section.classModel', 'items.studentFee.feeStructure.feeCategory']);
        
        $pdf = Pdf::loadView('receipts.fee', [
            'payment' => $payment,
            'school' => tenant(),
        ]);
        
        return $pdf->output();
    }

    private function generateReceiptNo(): string
    {
        $prefix = 'RCP';
        $year = date('y');
        $month = date('m');
        $last = FeePayment::whereMonth('created_at', date('m'))
            ->orderBy('id', 'desc')
            ->first();
        
        $number = $last 
            ? intval(substr($last->receipt_no, -5)) + 1 
            : 1;
            
        return $prefix . $year . $month . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}
```

### Razorpay Integration
```php
<?php

namespace App\Services;

use Razorpay\Api\Api;

class PaymentGatewayService
{
    private Api $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    public function createOrder(float $amount, array $notes = []): array
    {
        $order = $this->razorpay->order->create([
            'receipt' => 'rcpt_' . uniqid(),
            'amount' => $amount * 100, // In paise
            'currency' => 'INR',
            'notes' => $notes,
        ]);

        return [
            'order_id' => $order->id,
            'amount' => $amount,
            'key' => config('services.razorpay.key'),
        ];
    }

    public function verifyPayment(string $paymentId, string $orderId, string $signature): bool
    {
        $expected = hash_hmac(
            'sha256',
            $orderId . '|' . $paymentId,
            config('services.razorpay.secret')
        );

        return hash_equals($expected, $signature);
    }
}
```

---

## 💻 Frontend Implementation

### Fee Collection Interface
```typescript
// app/(payment)/collect/[studentId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/lib/api';

interface PendingFee {
  id: number;
  category: string;
  period: string;
  amount: number;
  paid: number;
  pending: number;
  selected: boolean;
}

export default function FeeCollectionPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [fees, setFees] = useState<PendingFee[]>([]);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentFees();
  }, [studentId]);

  const fetchStudentFees = async () => {
    const res = await api.get(`/students/${studentId}/fees`);
    setStudent(res.data.data.student);
    setFees(res.data.data.pending_fees.map((f: any) => ({
      ...f,
      selected: false,
    })));
  };

  const totalSelected = fees
    .filter(f => f.selected)
    .reduce((sum, f) => sum + f.pending, 0);

  const toggleFee = (id: number) => {
    setFees(fees.map(f => 
      f.id === id ? { ...f, selected: !f.selected } : f
    ));
  };

  const collectPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/fee-payments', {
        student_id: studentId,
        amount: totalSelected,
        payment_mode: paymentMode,
        fee_ids: fees.filter(f => f.selected).map(f => f.id),
      });
      
      // Download receipt
      window.open(`/api/fee-payments/${res.data.data.id}/receipt`, '_blank');
      
      // Refresh
      fetchStudentFees();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Student Info */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              {student?.name} - {student?.class_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Select</th>
                  <th className="p-3 text-left">Fee Type</th>
                  <th className="p-3 text-left">Period</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-t">
                    <td className="p-3">
                      <Checkbox 
                        checked={fee.selected}
                        onCheckedChange={() => toggleFee(fee.id)}
                      />
                    </td>
                    <td className="p-3">{fee.category}</td>
                    <td className="p-3">{fee.period}</td>
                    <td className="p-3 text-right">₹{fee.amount}</td>
                    <td className="p-3 text-right text-green-600">₹{fee.paid}</td>
                    <td className="p-3 text-right text-red-600 font-bold">₹{fee.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Collect Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Total Amount</label>
              <p className="text-3xl font-bold text-green-600">₹{totalSelected}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Payment Mode</label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={totalSelected === 0 || loading}
              onClick={collectPayment}
            >
              {loading ? 'Processing...' : 'Collect Payment & Print Receipt'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 📄 Receipt Template

```blade
{{-- resources/views/receipts/fee.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .receipt-no { font-size: 14px; color: #666; }
        .amount { font-size: 24px; font-weight: bold; color: #16a34a; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $school->name }}</h2>
        <p>{{ $school->address }}</p>
        <p class="receipt-no">Receipt No: {{ $payment->receipt_no }}</p>
    </div>
    
    <p><strong>Student:</strong> {{ $payment->student->full_name }}</p>
    <p><strong>Class:</strong> {{ $payment->student->class_name }}</p>
    <p><strong>Date:</strong> {{ $payment->payment_date->format('d M Y') }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Fee Type</th>
                <th>Period</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($payment->items as $item)
            <tr>
                <td>{{ $item->studentFee->feeStructure->feeCategory->name }}</td>
                <td>{{ $item->studentFee->period_start->format('M Y') }}</td>
                <td>₹{{ number_format($item->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>₹{{ number_format($payment->amount, 2) }}</strong></td>
            </tr>
        </tfoot>
    </table>
    
    <p><strong>Payment Mode:</strong> {{ ucfirst($payment->payment_mode) }}</p>
    <p><strong>Received By:</strong> {{ $payment->collectedBy->name }}</p>
</body>
</html>
```

---

## ✅ Verification Plan

| Test | Expected Result |
|------|-----------------|
| Create fee structure | Structure created for class |
| Generate student fees | All students get fee records |
| Collect partial payment | Status shows 'partial' |
| Collect full payment | Status shows 'paid' |
| Generate receipt | PDF downloads correctly |
| Online payment | Razorpay payment works |
| Outstanding report | Shows correct pending amounts |

---

## 📝 Implementation Checklist

- [ ] Create all fee tables
- [ ] Create FeeCollectionService
- [ ] Integrate Razorpay
- [ ] Create PDF receipt template
- [ ] Create fee controllers
- [ ] Filament: Fee structure management
- [ ] Filament: Discount management
- [ ] Frontend: Fee collection interface
- [ ] Frontend: Online payment flow
- [ ] Frontend: Collection reports

---

> 📝 **Next Module**: [09-examination-system.md](./09-examination-system.md)
