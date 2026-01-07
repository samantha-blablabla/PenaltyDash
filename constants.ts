import { Transaction, TransactionType, UserProfile } from './types';

export const TEAM_PASSWORD = '123'; // Mật khẩu mặc định

export const TEAM_MEMBERS: UserProfile[] = [
  { name: 'Đinh Thiện', role: 'Manager Marketing', avatar: 'https://robohash.org/thien_manager.png?set=set4&size=150x150' },
  { name: 'Thí Zi', role: 'Designer', avatar: 'https://robohash.org/vy_designer.png?set=set4&size=150x150' },
  { name: 'Bảo Hân', role: 'Junior Marketing', avatar: 'https://robohash.org/han_marketing.png?set=set4&size=150x150' },
  { name: 'Quỳnh Anh', role: 'Junior Marketing', avatar: 'https://robohash.org/quynh_marketing.png?set=set4&size=150x150' },
  { name: 'Lê Minh', role: 'Junior Marketing', avatar: 'https://robohash.org/minh_marketing.png?set=set4&size=150x150' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: TransactionType.INCOME,
    amount: 500000,
    category: 'Đi trễ',
    description: 'Đi họp trễ 15 phút',
    relatedPerson: 'Đinh Thiện',
    date: '2023-10-05',
    status: 'completed',
  },
  {
    id: '2',
    type: TransactionType.INCOME,
    amount: 200000,
    category: 'Quên chấm công',
    description: 'Quên checkout chiều thứ 6',
    relatedPerson: 'Bảo Hân',
    date: '2023-10-08',
    status: 'completed',
  },
  {
    id: '3',
    type: TransactionType.EXPENSE,
    amount: 1500000,
    category: 'Liên hoan',
    description: 'Mua pizza và nước ngọt cho team',
    relatedPerson: 'Đinh Thiện',
    date: '2023-10-15',
    status: 'completed',
  },
  {
    id: '4',
    type: TransactionType.INCOME,
    amount: 50000,
    category: 'Vi phạm quy định',
    description: 'Không dọn dẹp bàn làm việc',
    relatedPerson: 'Lê Minh',
    date: '2023-10-20',
    status: 'pending',
  },
  {
    id: '5',
    type: TransactionType.EXPENSE,
    amount: 300000,
    category: 'Văn phòng phẩm',
    description: 'Mua bút viết bảng và giấy note',
    relatedPerson: 'Quỳnh Anh',
    date: '2023-10-25',
    status: 'completed',
  },
  {
    id: '6',
    type: TransactionType.INCOME,
    amount: 100000,
    category: 'Đi trễ',
    description: 'Đi làm muộn sáng thứ 2',
    relatedPerson: 'Thí Zi',
    date: '2023-11-01',
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