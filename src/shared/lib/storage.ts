// src/shared/lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 공용 AsyncStorage 래퍼
 * - key-value 기반 저장소
 * - JSON 자동 직렬화/역직렬화 지원
 */

export const storage = {
  /**
   * 값 저장
   * @param key 저장 키
   * @param value 저장할 값 (객체 또는 문자열)
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`[storage] set 실패 (key=${key})`, e);
    }
  },

  /**
   * 값 가져오기
   * @param key 가져올 키
   * @returns 저장된 값 (없으면 null)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(`[storage] get 실패 (key=${key})`, e);
      return null;
    }
  },

  /**
   * 특정 키 삭제
   */
  async remove(key: string): Promise<void> {
    try {
      if (!key || typeof key !== 'string') {
        console.error(`[storage] 잘못된 키 (key=${key})`);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`[storage] remove 실패 (key=${key})`, e);
    }
  },

  /**
   * 전체 스토리지 비우기
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("[storage] clear 실패", e);
    }
  },


};
