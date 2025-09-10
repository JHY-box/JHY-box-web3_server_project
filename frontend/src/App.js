import React, { useState } from 'react';
import fetchHelper from './helpers/FetchHelper';

function App() {
  const [signedMsg, setSignedMsg] = useState(null);
  const [signTestRes, setSignTestRes] = useState('(Not called yet)');
  const [submitRes, setSubmitRes] = useState('(Waiting for Step 1)');
  const [messagesRes, setMessagesRes] = useState('(Not called yet)');
  const [loading, setLoading] = useState({ sign: false, submit: false, messages: false });

  // Step 1: /sign-test 호출
  const handleSignTest = async () => {
    setLoading(l => ({ ...l, sign: true }));
    setSignTestRes('Loading...');
    try {
      const data = await fetchHelper.get('http://localhost:8080/sign-test');
      setSignedMsg(data);
      setSignTestRes(JSON.stringify(data, null, 2));
      setSubmitRes('(Ready to submit)');
    } catch (e) {
      setSignTestRes(`Error: ${e.message}`);
    }
    setLoading(l => ({ ...l, sign: false }));
  };

  // Step 2: /submit 호출
  const handleSubmit = async () => {
    if (!signedMsg) {
      setSubmitRes('Error: No payload from Step 1.');
      return;
    }
    setLoading(l => ({ ...l, submit: true }));
    setSubmitRes('Loading...');
    try {
      // fetchHelper.post는 FormData로 변환하므로, JSON 직접 전송하려면 fetch를 써야 함
      const res = await fetch('http://localhost:8080/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedMsg),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status} - ${text}`);
      setSubmitRes(`Success: ${text}`);
    } catch (e) {
      setSubmitRes(`Error: ${e.message}`);
    }
    setLoading(l => ({ ...l, submit: false }));
  };

  // Step 3: /messages 호출
  const handleMessages = async () => {
    setLoading(l => ({ ...l, messages: true }));
    setMessagesRes('Loading...');
    try {
      const data = await fetchHelper.get('http://localhost:8080/messages');
      setMessagesRes(JSON.stringify(data, null, 2));
    } catch (e) {
      setMessagesRes(`Error: ${e.message}`);
    }
    setLoading(l => ({ ...l, messages: false }));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>Go Web3 Server Frontend Test (React)</h1>

      <div className="step" style={{ marginBottom: 30}}>
        <h2>Step 1: Get Signed Message Sample</h2>
        <button onClick={handleSignTest} disabled={loading.sign}>
          /sign-test 호출
        </button>
        <p className="status">Response:</p>
        <pre>{signTestRes}</pre>
      </div>

      <div className="step" style={{ marginBottom: 30 }}>
        <h2>Step 2: Submit for Verification</h2>
        <button onClick={handleSubmit} disabled={!signedMsg || loading.submit}>
          /submit 호출
        </button>
        <p className="status">Response:</p>
        <pre>{submitRes}</pre>
      </div>

      <div className="step" style={{ marginBottom: 30 }}>
        <h2>Step 3: View All Verified Messages</h2>
        <button onClick={handleMessages} disabled={loading.messages}>
          /messages 호출
        </button>
        <p className="status">Response:</p>
        <pre>{messagesRes}</pre>
      </div>
    </div>
  );
}

export default App;