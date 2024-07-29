import { useCallback, useEffect, useState } from "react";
import Vector2 from "./Vector2";

export interface InputHandler {
  /**
   * キーの状態を取得
   * @param key 取得するキー
   * @returns キーが押されているかどうか
   */
  getKeyState: (key: string) => boolean;

  /**
   * キーDownに対するコールバック関数を登録
   * @param key 登録キー
   * @param callback コールバック関数
   * @returns 登録ID(削除用)
   */
  addKeyDownCallback: (key: string, callback: () => void) => number;

  /**
   *
   * キーUpに対するコールバック関数を登録
   * @param key 登録キー
   * @param callback コールバック関数
   * @returns 登録ID(削除用)
   */
  addKeyUpCallback: (key: string, callback: () => void) => number;

  /**
   * キーDownに対するコールバック関数を削除
   * @param key 登録されているキー
   * @param id 登録ID
   */
  deleteKeyDownCallback: (key: string, callbackId: number) => void;

  /**
   * キーUpに対するコールバック関数を削除
   * @param key 登録されているキー
   * @param id 登録ID
   */
  deleteKeyUpCallback: (key: string, callbackId: number) => void;

  /**
   * マウスの位置を取得
   */
  getMousePosiotion: () => Vector2;

  /**
   * マウスボタンの状態を取得
   * @param button 取得するマウスボタン
   * @returns マウスボタンが押されているかどうか
   */
  getButtonState: (button: number) => boolean;

  /**
   * マウスボタンDownに対するコールバック関数を登録
   * @param button 登録マウスボタン
   * @param callback コールバック関数
   * @returns 登録ID(削除用)
   */
  addButtonDownCallback: (button: number, callback: () => void) => number;

  /**
   *
   * マウスボタンUpに対するコールバック関数を登録
   * @param button 登録マウスボタン
   * @param callback コールバック関数
   * @returns 登録ID(削除用)
   */
  addButtonUpCallback: (button: number, callback: () => void) => number;

  /**
   * マウスボタンDownに対するコールバック関数を削除
   * @param button 登録されているマウスボタン
   * @param id 登録ID
   */
  deleteButtonDownCallback: (button: number, callbackId: number) => void;

  /**
   * マウスボタンUpに対するコールバック関数を削除
   * @param button 登録されているマウスボタン
   * @param id 登録ID
   */
  deleteButtonUpCallback: (button: number, callbackId: number) => void;
}

/**
 * 入力管理関数コンポーネント
 * @param targetKeys ゲーム内で取得するキーリスト
 * @param targetButtons ゲーム内で取得するマウスボタンリスト
 * @returns ハンドラ
 */
function useInput(targetKeys: string[], targetButtons: number[]): InputHandler {
  // キー状態のRecord
  const [keyRecord, setKeyRecord] = useState<Record<string, boolean>>(
    targetKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  // キーDownコールバックのRecord
  const [keyDownCallbackRecord, setKeyDownCallbackRecord] = useState<
    Record<string, Map<number, () => void>>
  >(targetKeys.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {}));

  // キーUpコールバックのRecord
  const [keyUpCallbackRecord, setKeyUpCallbackRecord] = useState<
    Record<string, Map<number, () => void>>
  >(targetKeys.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {}));

  // マウスの位置
  const [mousePosition, setMousePosition] = useState(new Vector2());

  // マウスボタン状態のRecord
  const [buttonRecord, setButtonRecord] = useState<Record<number, boolean>>(
    targetButtons.reduce((acc, button) => ({ ...acc, [button]: false }), {})
  );
  // マウスボタンDownコールバックのRecord
  const [buttonDownCallbackRecord, setButtonDownCallbackRecord] = useState<
    Record<number, Map<number, () => void>>
  >(
    targetButtons.reduce((acc, button) => ({ ...acc, [button]: new Map() }), {})
  );

  // マウスボタンUpコールバックのRecord
  const [buttonUpCallbackRecord, setButtonUpCallbackRecord] = useState<
    Record<number, Map<number, () => void>>
  >(
    targetButtons.reduce((acc, button) => ({ ...acc, [button]: new Map() }), {})
  );

  /**
   * useEffect
   */
  useEffect(() => {
    // Downイベント
    const handleKeyDown = (event: KeyboardEvent) => {
      if (targetKeys.includes(event.key)) {
        setKeyRecord((prev) => ({ ...prev, [event.key]: true }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keyDownCallbackRecord[event.key].forEach((handler, _) => handler());
      }
    };

    // Upイベント
    const handleKeyUp = (event: KeyboardEvent) => {
      if (targetKeys.includes(event.key)) {
        setKeyRecord((prev) => ({ ...prev, [event.key]: false }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keyUpCallbackRecord[event.key].forEach((handler, _) => handler());
      }
    };

    // マウス位置イベント
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target) {
        if (target.className == "overlay") {
          setMousePosition(new Vector2(event.offsetX, event.offsetY));
        }
      }
    };

    // マウスDownイベント
    const handleMouseDown = (event: MouseEvent) => {
      setButtonRecord((prev) => ({ ...prev, [event.button]: true }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      buttonDownCallbackRecord[event.button].forEach((handler, _) => handler());
    };

    // マウスUpイベント
    const handleMouseUp = (event: MouseEvent) => {
      setButtonRecord((prev) => ({ ...prev, [event.button]: false }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      buttonUpCallbackRecord[event.button].forEach((handler, _) => handler());
    };

    // イベント登録
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    console.log("Initialize useInputs");

    return () => {
      console.log("Unmount useInputs");
      // アンマウント時にイベントを除去
      initializeCallbackRecord();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /**
   * Recordを初期化する関数
   */
  function initializeCallbackRecord() {
    setKeyDownCallbackRecord(
      targetKeys.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {})
    );
    setKeyUpCallbackRecord(
      targetKeys.reduce((acc, key) => ({ ...acc, [key]: new Map() }), {})
    );
    setButtonDownCallbackRecord(
      targetButtons.reduce(
        (acc, button) => ({ ...acc, [button]: new Map() }),
        {}
      )
    );
    setButtonUpCallbackRecord(
      targetButtons.reduce(
        (acc, button) => ({ ...acc, [button]: new Map() }),
        {}
      )
    );
  }

  /**
   *
   * @param key 入力キー
   * @returns 入力状態
   */
  const getKeyState = useCallback(
    (key: string) => {
      return keyRecord[key];
    },
    [keyRecord]
  );

  /**
   *
   * @param key 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  const addKeyDownCallback = useCallback(
    (key: string, callback: () => void): number => {
      const id = Math.floor(Math.random() * 10000);
      keyDownCallbackRecord[key].set(id, callback);

      return id;
    },
    [keyDownCallbackRecord]
  );

  /**
   *
   * @param key 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  const addKeyUpCallback = useCallback(
    (key: string, callback: () => void): number => {
      const id = Math.floor(Math.random() * 10000);
      keyUpCallbackRecord[key].set(id, callback);

      return id;
    },
    [keyUpCallbackRecord]
  );

  /**
   *
   * @param key 登録されているキー
   * @param id 削除するID
   */
  const deleteKeyDownCallback = useCallback(
    (key: string, id: number) => {
      keyDownCallbackRecord[key].delete(id);
    },
    [keyDownCallbackRecord]
  );

  /**
   *
   * @param key 登録されているキー
   * @param id 削除するID
   */
  const deleteKeyUpCallback = useCallback(
    (key: string, id: number) => {
      keyDownCallbackRecord[key].delete(id);
    },
    [keyDownCallbackRecord]
  );

  /**
   *
   * @returns マウスの位置
   */
  const getMousePosiotion = useCallback(() => {
    return mousePosition;
  }, [mousePosition]);

  /**
   *
   * @param button 入力キー
   * @returns 入力状態
   */
  const getButtonState = useCallback(
    (button: number) => {
      return buttonRecord[button];
    },
    [buttonRecord]
  );

  /**
   *
   * @param button 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  const addButtonDownCallback = useCallback(
    (button: number, callback: () => void): number => {
      const id = Math.floor(Math.random() * 10000);
      buttonDownCallbackRecord[button].set(id, callback);

      return id;
    },
    [buttonDownCallbackRecord]
  );

  /**
   *
   * @param button 入力キー
   * @param callback 登録するコールバック関数
   * @returns 登録ID
   */
  const addButtonUpCallback = useCallback(
    (button: number, callback: () => void): number => {
      const id = Math.floor(Math.random() * 10000);
      buttonUpCallbackRecord[button].set(id, callback);

      return id;
    },
    [buttonUpCallbackRecord]
  );

  /**
   *
   * @param button 登録されているキー
   * @param id 削除するID
   */
  const deleteButtonDownCallback = useCallback((button: number, id: number) => {
    buttonDownCallbackRecord[button].delete(id);
  }, []);

  /**
   *
   * @param button 登録されているキー
   * @param id 削除するID
   */
  const deleteButtonUpCallback = useCallback((button: number, id: number) => {
    buttonDownCallbackRecord[button].delete(id);
  }, []);

  // 外部メソッドを返す
  return {
    getKeyState,
    addKeyDownCallback,
    addKeyUpCallback,
    deleteKeyDownCallback,
    deleteKeyUpCallback,
    getMousePosiotion,
    getButtonState,
    addButtonDownCallback,
    addButtonUpCallback,
    deleteButtonDownCallback,
    deleteButtonUpCallback,
  };
}

export default useInput;
