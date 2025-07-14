import { create } from 'zustand';
import { Staff, StaffStatus, StaffStatusLog } from '@/src/types/staff';

interface StaffState {
  staff: Staff[];
  logs: StaffStatusLog[];
  initializeData: () => void;
  updateStaffStatus: () => void;
}

// 日本人の名前リスト
const firstNames = [
  '太郎', '次郎', '三郎', '花子', '美咲', '健太', '優子', '大輔', '愛', '翔太',
  '裕子', '健一', '恵美', '拓也', '由美', '浩二', '真理子', '隆', '幸子', '正人',
  '洋子', '達也', '久美子', '誠', '千恵', '雄一', '典子', '明', '和子', '剛',
  '京子', '博', '順子', '豊', '良子', '勇', '節子', '茂', '清子', '進',
  '春子', '修', '夏子', '学', '秋子', '守', '冬子', '実', '桜子', '勝'
];

const lastNames = [
  '田中', '鈴木', '佐藤', '高橋', '伊藤', '山田', '渡辺', '中村', '小林', '加藤',
  '吉田', '山本', '森', '村上', '斎藤', '井上', '木村', '林', '清水', '山崎'
];

const departments = ['製造一課', '製造二課', '製造三課', '品質管理課', '技術課'];
const shifts: ('morning' | 'afternoon' | 'night')[] = ['morning', 'afternoon', 'night'];
const statuses: StaffStatus[] = ['PROCESSING', 'ASSEMBLY', 'QUALITY_CHECK', 'INSPECTION', 'BREAK', 'LEAVE'];

// ランダムなスタッフデータを生成
const generateStaff = (count: number): Staff[] => {
  const staff: Staff[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let fullName: string;
    do {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullName = `${lastName} ${firstName}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    
    const gender = Math.random() > 0.3 ? 'male' : 'female';
    const age = Math.floor(Math.random() * 40) + 20; // 20-59歳
    
    staff.push({
      id: `STF-${String(i + 1).padStart(3, '0')}`,
      employeeNumber: `E${String(i + 1).padStart(4, '0')}`,
      name: fullName,
      gender,
      age,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      shift: shifts[Math.floor(Math.random() * shifts.length)],
      statusStartTime: new Date(Date.now() - Math.random() * 3600000), // 過去1時間以内
    });
  }
  
  return staff;
};

export const useStaffStore = create<StaffState>()((set, get) => ({
  staff: [],
  logs: [],
  
  initializeData: () => {
    set({ staff: generateStaff(100) });
  },
  
  updateStaffStatus: () => {
    const { staff } = get();
    const updateCount = Math.floor(Math.random() * 5) + 1; // 1-5人のステータスを更新
    
    const updatedStaff = [...staff];
    const indicesToUpdate = new Set<number>();
    
    // ランダムに更新するスタッフを選択
    while (indicesToUpdate.size < updateCount) {
      indicesToUpdate.add(Math.floor(Math.random() * staff.length));
    }
    
    indicesToUpdate.forEach(index => {
      const currentStatus = updatedStaff[index].status;
      let newStatus: StaffStatus;
      
      // 現在と異なるステータスを選択
      do {
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      } while (newStatus === currentStatus);
      
      updatedStaff[index] = {
        ...updatedStaff[index],
        status: newStatus,
        statusStartTime: new Date(),
      };
    });
    
    set({ staff: updatedStaff });
  },
}));