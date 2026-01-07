import { Transaction, TransactionType } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: TransactionType.INCOME,
    amount: 500000,
    category: 'Đi trễ',
    description: 'Nguyễn Văn A đi làm trễ 3 lần T10',
    date: '2023-10-05',
    status: 'completed',
  },
  {
    id: '2',
    type: TransactionType.INCOME,
    amount: 200000,
    category: 'Quên chấm công',
    description: 'Trần Thị B quên checkout',
    date: '2023-10-08',
    status: 'completed',
  },
  {
    id: '3',
    type: TransactionType.EXPENSE,
    amount: 1500000,
    category: 'Liên hoan',
    description: 'Mua pizza và nước ngọt cho team',
    date: '2023-10-15',
    status: 'completed',
  },
  {
    id: '4',
    type: TransactionType.INCOME,
    amount: 100000,
    category: 'Vi phạm quy định',
    description: 'Không dọn dẹp bàn làm việc',
    date: '2023-10-20',
    status: 'pending',
  },
  {
    id: '5',
    type: TransactionType.EXPENSE,
    amount: 300000,
    category: 'Văn phòng phẩm',
    description: 'Mua bút viết bảng và giấy note',
    date: '2023-10-25',
    status: 'completed',
  },
  {
    id: '6',
    type: TransactionType.INCOME,
    amount: 2000000,
    category: 'Thưởng nóng (Quỹ)',
    description: 'Đóng góp từ Ban Giám Đốc',
    date: '2023-11-01',
    status: 'completed',
  },
   {
    id: '7',
    type: TransactionType.EXPENSE,
    amount: 500000,
    category: 'Sửa chữa',
    description: 'Sửa máy pha cà phê',
    date: '2023-11-02',
    status: 'completed',
  },
];

export const CATEGORIES = [
  'Đi trễ',
  'Quên chấm công',
  'Vi phạm quy định',
  'Liên hoan',
  'Văn phòng phẩm',
  'Sửa chữa',
  'Khác',
  'Thưởng nóng (Quỹ)'
];
