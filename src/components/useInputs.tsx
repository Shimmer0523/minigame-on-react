import { useEffect, useState } from "react";

export interface InputHandlers {
  getInputState: (key: string) => boolean;
  addInputDownHandler: (key: string, handler: () => void) => void;
  addInputUpHandler: (key: string, handler: () => void) => void;
}

function useInputs(targetKeys: string[]): InputHandlers {
  // 入力状態のRecord
  const [inputRecord, setInputRecord] = useState<Record<string, boolean>>(
    targetKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  // 入力DownコールバックのRecord
  const [inputDownHandlerRecord, setInputDownHandlerRecord] = useState<
    Record<string, [() => void]>
  >(targetKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));

  // 入力UpコールバックのRecord
  const [inputUpHandlerRecord, setInputUpHandlerRecord] = useState<
    Record<string, [() => void]>
  >(targetKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));

  // Recordを初期化する関数
  const initializeHandlerRecord = () => {
    setInputDownHandlerRecord(
      targetKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
    );
    setInputUpHandlerRecord(
      targetKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
    );
  };

  /**
   *
   * @param key 入力キー
   * @returns 入力状態
   */
  const getInputState = (key: string) => inputRecord[key];

  /**
   *
   * @param key 入力キー
   * @param handler 登録するハンドラ
   */
  const addInputDownHandler = (key: string, handler: () => void) => {
    inputDownHandlerRecord[key].push(handler);
  };

  /**
   *
   * @param key 入力キー
   * @param handler 登録するハンドラ
   */
  const addInputUpHandler = (key: string, handler: () => void) => {
    inputUpHandlerRecord[key].push(handler);
  };

  // イベントを登録
  useEffect(() => {
    // Downイベント
    const handleInputDown = (event: KeyboardEvent) => {
      if (targetKeys.includes(event.key)) {
        setInputRecord((prev) => ({ ...prev, [event.key]: true }));
        inputDownHandlerRecord[event.key].forEach((handler) => handler());
      }
    };

    // Upイベント
    const handleInputUp = (event: KeyboardEvent) => {
      if (targetKeys.includes(event.key)) {
        setInputRecord((prev) => ({ ...prev, [event.key]: false }));
        inputUpHandlerRecord[event.key].forEach((handler) => handler());
      }
    };

    // イベント登録
    window.addEventListener("keydown", handleInputDown);
    window.addEventListener("keyup", handleInputUp);

    console.log("Initialize useInputs");

    return () => {
      console.log("Unmount useInputs");
      // アンマウント時にイベントを除去
      initializeHandlerRecord();
      window.removeEventListener("keydown", handleInputDown);
      window.removeEventListener("keyup", handleInputUp);
    };
  }, []);

  // 外部メソッドを返す
  return {
    getInputState,
    addInputDownHandler,
    addInputUpHandler,
  };
}

export default useInputs;
