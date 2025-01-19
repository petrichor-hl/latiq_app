import { useEffect, useState } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

export const useCountdownController = () => {
  const [countdown, setCountdown] = useState(3);
  const scale = useSharedValue(2.5);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.ease }); // Thu lại
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) {
          scale.value = 2.5; // Phóng to ngay lập tức
          scale.value = withTiming(1, { duration: 300, easing: Easing.ease }); // Thu lại
          return prev - 1;
        } else {
          clearInterval(timer); // Xóa bộ đếm khi hoàn tất
          scale.value = withTiming(1, { duration: 200, easing: Easing.ease }); // Quay lại kích thước ban đầu
          return 0;
        }
      });
    }, 1000); // Giảm mỗi giây
    return () => clearInterval(timer); // Dọn dẹp khi component bị hủy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refs: {},
    values: {
      scale,
      countdown,
    },
    actions: {},
  };
};
