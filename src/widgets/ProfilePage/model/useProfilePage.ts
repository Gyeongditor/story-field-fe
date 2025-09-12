import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, deleteMyAccount } from '../../../entities/user/user.service';
import { useAuthStore, authActions } from '../../../shared/stores/authStore';
import type { UserProfileUpdateRequest } from '../../../entities/user/user.types';

export const useProfilePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  
  // 프로필 정보 조회
  const {
    data: profile,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await getMyProfile();
      return response.data;
    },
    retry: 3,
    retryDelay: 1000
  });

  // 프로필 업데이트 mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: UserProfileUpdateRequest) => {
      return await updateMyProfile(updateData);
    },
    onSuccess: () => {
      Alert.alert(
        '성공',
        '프로필이 성공적으로 업데이트되었습니다.',
        [{ text: '확인' }]
      );
      // 쿼리 무효화하여 새로운 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setHasChanges(false);
      // 비밀번호 필드 초기화
      setFormData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
    },
    onError: (error: any) => {
      console.error('프로필 업데이트 실패:', error);
      console.error('에러 상세:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        config: {
          url: error?.config?.url,
          method: error?.config?.method,
          data: error?.config?.data
        }
      });
      
      let errorMessage = '프로필 업데이트에 실패했습니다.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error?.response?.status === 422) {
        errorMessage = '입력한 정보의 형식이 올바르지 않습니다.';
      } else if (error?.response?.status === 401) {
        errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
      } else if (error?.response?.status === 403) {
        errorMessage = '접근 권한이 없습니다.';
      }
      
      Alert.alert('오류', errorMessage, [{ text: '확인' }]);
    }
  });

  // 계정 삭제 mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await deleteMyAccount();
    },
    onSuccess: () => {
      Alert.alert(
        '회원 탈퇴 완료',
        '계정이 성공적으로 삭제되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              // 로그아웃 처리 후 로그인 화면으로 이동
              authActions.logout();
              router.replace('/auth/login');
            }
          }
        ]
      );
    },
    onError: (error: any) => {
      console.error('계정 삭제 실패:', error);
      
      let errorMessage = '계정 삭제에 실패했습니다.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
      } else if (error?.response?.status === 403) {
        errorMessage = '접근 권한이 없습니다.';
      } else if (error?.response?.status === 404) {
        errorMessage = '존재하지 않는 계정입니다.';
      }
      
      Alert.alert('오류', errorMessage, [{ text: '확인' }]);
    }
  });

  // 프로필 데이터가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        username: profile.username || '',
        password: '',
        passwordConfirm: ''
      });
      setHasChanges(false);
    }
  }, [profile]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        '변경사항이 있습니다',
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '나가기', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  // 폼 변경 핸들러
  const handleFormChange = (field: 'email' | 'username' | 'password' | 'passwordConfirm', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // 변경사항 확인 (비밀번호는 제외하고 확인)
      if (profile) {
        const emailChanged = newData.email !== profile.email;
        const usernameChanged = newData.username !== profile.username;
        const passwordAdded = newData.password.length > 0 || newData.passwordConfirm.length > 0;
        
        setHasChanges(emailChanged || usernameChanged || passwordAdded);
      }
      
      return newData;
    });
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!hasChanges) {
      Alert.alert('알림', '변경된 내용이 없습니다.', [{ text: '확인' }]);
      return;
    }

    // 유효성 검사
    if (!formData.email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.', [{ text: '확인' }]);
      return;
    }

    if (!formData.username.trim()) {
      Alert.alert('오류', '사용자명을 입력해주세요.', [{ text: '확인' }]);
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.', [{ text: '확인' }]);
      return;
    }

    // 비밀번호 유효성 검사
    if (formData.password.trim() || formData.passwordConfirm.trim()) {
      if (!formData.password.trim()) {
        Alert.alert('오류', '새 비밀번호를 입력해주세요.', [{ text: '확인' }]);
        return;
      }
      
      if (!formData.passwordConfirm.trim()) {
        Alert.alert('오류', '비밀번호 확인을 입력해주세요.', [{ text: '확인' }]);
        return;
      }
      
      if (formData.password !== formData.passwordConfirm) {
        Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.', [{ text: '확인' }]);
        return;
      }
      
      if (formData.password.length < 8) {
        Alert.alert('오류', '비밀번호는 8자 이상이어야 합니다.', [{ text: '확인' }]);
        return;
      }
    }

    // 업데이트 데이터 준비
    const updateData: UserProfileUpdateRequest = {
      email: formData.email,
      username: formData.username
    };

    // 비밀번호가 입력된 경우에만 포함
    if (formData.password.trim()) {
      updateData.password = formData.password;
    }

    updateProfileMutation.mutate(updateData);
  };

  // 계정 삭제 핸들러
  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 계정을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '탈퇴하기', 
          style: 'destructive',
          onPress: () => {
            // 한번 더 확인
            Alert.alert(
              '최종 확인',
              '마지막 확인입니다. 정말로 계정을 삭제하시겠습니까?',
              [
                { text: '취소', style: 'cancel' },
                { 
                  text: '삭제', 
                  style: 'destructive',
                  onPress: () => deleteAccountMutation.mutate()
                }
              ]
            );
          }
        }
      ]
    );
  };

  // 재시도 핸들러
  const handleRetry = () => {
    refetch();
  };

  // 사진 변경 핸들러 (추후 구현)
  const handleChangePhoto = () => {
    Alert.alert('준비중', '프로필 사진 변경 기능은 준비중입니다.', [{ text: '확인' }]);
  };

  return {
    // 데이터
    profile,
    isLoading,
    error: queryError?.message || null,
    
    // 폼 상태
    formData,
    hasChanges,
    
    // 액션 상태
    isSaving: updateProfileMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
    
    // 핸들러
    onBack: handleBack,
    onFormChange: handleFormChange,
    onSave: handleSave,
    onDeleteAccount: handleDeleteAccount,
    onRetry: handleRetry,
    onChangePhoto: handleChangePhoto
  };
};
