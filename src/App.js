import './App.css';
import { useState, useEffect, useRef } from 'react'; // useRefも追加

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [showBusinessOptions, setShowBusinessOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userName, setUserName] = useState("");
  const [confirmingName, setConfirmingName] = useState(false);
  const [hasAIMessaged, setHasAIMessaged] = useState(false);
  const [showPartnerOptions, setShowPartnerOptions] = useState(false); // パートナーのオプション表示のためのステート
  const [selectedPartners, setSelectedPartners] = useState([]); // 選択されたパートナーのリスト
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示状態管理
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // モーダルの開閉をトグル
  };
  const bottomRef = useRef(null);
  useEffect(() => {
    if (messages.length >= 3) { 
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOptions((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  const handlePartnerCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPartners((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasAIMessaged) {
      addMessage(text, 'user');
      initiateAIConversation();
      setHasAIMessaged(true);
      setText("");
      return;
    }

    if (confirmingName) {
      setUserName(text);
      addMessage(text, 'user');
      addMessage(`${text}さんでお間違いないですか？`, 'ai');
      setText("");
      setConfirmingName(false);
    } else if (text.trim() !== "" && userName === "") {
      setUserName(text);
      addMessage(text, 'user');
      addMessage(`${text}さんでお間違いないですか？`, 'ai');
      setText("");
      setConfirmingName(true);
    } else if (showBusinessOptions && selectedOptions.length > 0) {
      if (text.trim() !== "") {
        addMessage(text, 'user'); // テキストをユーザーからのメッセージとして追加
      }
  
      const interests = selectedOptions.join('、');
      addMessage(`選択：${interests}`, 'user'); // 選択内容をユーザーのメッセージとして追加
  
      if (selectedOptions.includes("その他")) {
        addMessage("なるほど、そのようなビジネスに興味があるのですね。", 'ai');
      } else {
        addMessage(`なるほど、${interests}についてのビジネスをお考えですね。`, 'ai');
      }
      setShowBusinessOptions(false);
      setTimeout(() => {
        addMessage("もう一つお聞きします。");
        

        setTimeout(() => {
          addMessage("一緒に働きたいパートナーはいますか？");
          
      setShowPartnerOptions(true); // パートナーオプションを表示

          

        }, 2000);

      }, 1000);

   

  
      // ビジネスオプションと選択項目をクリア
      
      
      
      
    } else if (showPartnerOptions && selectedPartners.length > 0) {
      const partners = selectedPartners.join('、');
      addMessage(`選択：${partners}`, 'user');
      

      
      setTimeout(() => {
        addMessage(`${partners}との協力を考えているのですね。`, 'ai');
        
        setShowPartnerOptions(false); // パートナーオプションを非表示
        
        setTimeout(() => {
          addMessage("回答ありがとうございました。ほかに追記することがあれば送信してください。");
          
      

          

        }, 2000);

      }, 1000);
    }
    
  
    setText("");
  };

  const handleConfirmName = (isConfirmed) => {
    addMessage(isConfirmed ? "はい" : "いいえ", 'user');
    if (isConfirmed) {
      addMessage(`それでは${userName}さんにお聞きします。`, 'ai'); // 名前が確認された後に送信
      setTimeout(() => {
        addMessage("どんなビジネスを考えていますか？");
        setShowBusinessOptions(true);

        setTimeout(() => {
          addMessage("その他を選んだ場合や何か追記したい場合はメッセージ入力欄に追記して、送信を押してください。");

          setTimeout(() => {
            addMessage("追記することがない場合は、リストにチェックだけを入れて送信してください。");
          }, 2000);

        }, 2000);

      }, 1000);

    
      setShowBusinessOptions(true); // ビジネスオプションを表示
      setConfirmingName(false); // ボタン非表示にするために確認状態を終了
    } else {
      addMessage("まずはあなたの名前を教えてください。", 'ai');
      setUserName("");
      setConfirmingName(false);
    }
  };

  const initiateAIConversation = () => {
    addMessage("こんにちはAI晴信です。あなたとマッチする経営者をご紹介します。", 'ai');
    setTimeout(() => {
      addMessage("まずはあなたの名前を教えてください。", 'ai');
    }, 500);
  };

  return (
    <div className="App">
    {/* ヘッダーバナー */}
    <div className="header-banner" onClick={handleModalToggle}>
      <span className="header-text">Data</span>
    </div>
      {/* Chat display */}
      <div className="chat-display">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === 'user' ? 'sent' : 'received'}`}
          >
            {message.text}
          </div>
        ))}
        {confirmingName && (
          <div className="confirmation-buttons">
            <button onClick={() => handleConfirmName(true)}>はい</button>
            <button onClick={() => handleConfirmName(false)}>いいえ</button>
          </div>
        )}
        <div ref={bottomRef} /> {/* 自動スクロールのための参照 */}
      </div>

      {/* ビジネスオプションのチェックリスト */}
      {showBusinessOptions && (
        <div className="business-options">
          <label><input type="checkbox" value="飲食" onChange={handleCheckboxChange} /> 飲食</label>
          <label><input type="checkbox" value="不動産" onChange={handleCheckboxChange} /> 不動産</label>
          <label><input type="checkbox" value="運送" onChange={handleCheckboxChange} /> 運送</label>
          <label><input type="checkbox" value="金融" onChange={handleCheckboxChange} /> 金融</label>
          <label><input type="checkbox" value="保険" onChange={handleCheckboxChange} /> 保険</label>
          <label><input type="checkbox" value="卸売" onChange={handleCheckboxChange} /> 卸売</label>
          <label><input type="checkbox" value="修理" onChange={handleCheckboxChange} /> 修理</label>
          <label><input type="checkbox" value="宿泊" onChange={handleCheckboxChange} /> 宿泊</label>
          <label><input type="checkbox" value="その他" onChange={handleCheckboxChange} /> その他</label>
        </div>
      )}

      {/* パートナーオプションのチェックリスト */}
    {showPartnerOptions && (
      <div className="partner-options">
        <label><input type="checkbox" value="アラブ人" onChange={handlePartnerCheckboxChange} /> アラブ人</label>
        <label><input type="checkbox" value="アジア人" onChange={handlePartnerCheckboxChange} /> アジア人</label>
        <label><input type="checkbox" value="ヨーロッパ人" onChange={handlePartnerCheckboxChange} /> ヨーロッパ人</label>
        <label><input type="checkbox" value="アフリカ人" onChange={handlePartnerCheckboxChange} /> アフリカ人</label>
        <label><input type="checkbox" value="南アメリカ人" onChange={handlePartnerCheckboxChange} /> 南アメリカ人</label>
        <label><input type="checkbox" value="北アメリカ人" onChange={handlePartnerCheckboxChange} /> 北アメリカ人</label>
        <label><input type="checkbox" value="オセアニア人" onChange={handlePartnerCheckboxChange} /> オセアニア人</label>
        
      </div>
    )}
      {/* モーダルウィンドウ */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>回答内容</h2>
            <p>名前: {userName || "未設定"}</p>

            <h3>選択したビジネスモデル</h3>
            {selectedOptions.length > 0 ? (
              <ul>
                {selectedOptions.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            ) : (
              <p>ビジネスモデルが選択されていません</p>
            )}

            <h3>選択したパートナー</h3>
            {selectedPartners.length > 0 ? (
              <ul>
                {selectedPartners.map((partner, index) => (
                  <li key={index}>{partner}</li>
                ))}
              </ul>
            ) : (
              <p>パートナーが選択されていません</p>
            )}

            <button className="close-button" onClick={handleModalToggle}>
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Chat input form */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="ここにメッセージを入力"
          className="chat-textarea"
          rows="2"
        />
        <button type="submit" className="chat-submit-button">送信</button>
      </form>
    </div>
  );
}

export default App;















