import { useEffect, useState } from "react";

export interface InputHandler {
  getInputState: (key: string) => boolean;
  addInputDownCallback: (key: string, callback: () => void) => number;
  addInputUpCallback: (key: string, callback: () => void) => number;
  deleteInputDownCallback: (key: string, callbackId: number) => void;
  deleteInputUpCallback: (key: string, callbackId: number) => void;
}

/**
 * 入力ハンドリング用関数コンポーネント
 * @param targetKeys ゲーム内で制御するべき入力一覧
 * @returns メソッド群
 */
function useInput(targetInputs: string[]): InputHandler {
  // 入力状態のRecord
  const [inputRecord, setInputRecord] = useState<Record<string, boolean>>(
    targetInputs.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  // 入力DownコールバックのRecord
  const [inputDownCallbackRecord, setInputDownCallbackRecord] = useState<
    Record<string, Map<number, () => void>>
  >(targetInputs.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {}));

  // 入力UpコールバックのRecord
  const [inputUpCallbackRecord, setInputUpCallbackRecord] = useState<
    Record<string, Map<number, () => void>>
  >(targetInputs.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {}));

  /**
   * useEffect
   */
  useEffect(() => {
    // Downイベント
    const handleInputDown = (event: KeyboardEvent) => {
      console.log(event.key);
      if (targetInputs.includes(event.key)) {
        setInputRecord((prev) => ({ ...prev, [event.key]: true }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        inputDownCallbackRecord[event.key].forEach((handler, _) => handler());
      }
    };

    // Upイベント
    const handleInputUp = (event: KeyboardEvent) => {
      if (targetInputs.includes(event.key)) {
        setInputRecord((prev) => ({ ...prev, [event.key]: false }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        inputUpCallbackRecord[event.key].forEach((handler, _) => handler());
      }
    };

    // イベント登録
    window.addEventListener("keydown", handleInputDown);
    window.addEventListener("keyup", handleInputUp);

    console.log("Initialize useInputs");

    return () => {
      console.log("Unmount useInputs");
      // アンマウント時にイベントを除去
      initializeCallbackRecord();
      window.removeEventListener("keydown", handleInputDown);
      window.removeEventListener("keyup", handleInputUp);
    };
  }, []);

  // Recordを初期化する関数
  function initializeCallbackRecord() {
    setInputDownCallbackRecord(
      targetInputs.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {})
    );
    setInputUpCallbackRecord(
      targetInputs.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {})
    );
  }

  /**
   *
   * @param key 入力キー
   * @returns 入力状態
   */
  function getInputState(key: string) {
    return inputRecord[key];
  }

  /**
   *
   * @param key 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  function addInputDownCallback(key: string, callback: () => void): number {
    const id = Math.floor(Math.random() * 10000);
    inputDownCallbackRecord[key].set(id, callback);

    return id;
  }

  /**
   *
   * @param key 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  function addInputUpCallback(key: string, callback: () => void): number {
    const id = Math.floor(Math.random() * 10000);
    inputUpCallbackRecord[key].set(id, callback);

    return id;
  }

  /**
   *
   * @param key 削除するキー
   * @param id 削除するID
   */
  function deleteInputDownCallback(key: string, id: number) {
    inputDownCallbackRecord[key].delete(id);
  }

  /**
   *
   * @param key 削除するキー
   * @param id 削除するID
   */
  function deleteInputUpCallback(key: string, id: number) {
    inputDownCallbackRecord[key].delete(id);
  }

  // 外部メソッドを返す
  return {
    getInputState,
    addInputDownCallback,
    addInputUpCallback,
    deleteInputDownCallback,
    deleteInputUpCallback,
  };
}

export default useInput;
