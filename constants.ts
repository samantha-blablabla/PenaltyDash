import { Transaction, TransactionType, UserProfile } from './types';

export const TEAM_PASSWORD = '123'; // Mật khẩu mặc định

export const TEAM_MEMBERS: UserProfile[] = [
  { name: 'Đinh Thiện', role: 'Manager Marketing', avatar: 'https://robohash.org/thien_manager.png?set=set4&size=150x150' },
  { name: 'Thí Zi', role: 'Designer', avatar: 'https://robohash.org/vy_designer.png?set=set4&size=150x150' },
  { name: 'Bảo Hân', role: 'Junior Marketing', avatar: 'https://robohash.org/han_marketing.png?set=set4&size=150x150' },
  { name: 'Quỳnh Anh', role: 'Junior Marketing', avatar: 'https://robohash.org/quynh_marketing.png?set=set4&size=150x150' },
  { name: 'Lê Minh', role: 'Junior Marketing', avatar: 'https://robohash.org/minh_marketing.png?set=set4&size=150x150' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [];

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