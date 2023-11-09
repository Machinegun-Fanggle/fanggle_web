// pages/api/signature.js
import { KEYUTIL, Signature } from 'jsrsasign';

export default function handler(req, res) {
  // User-Data-Here
  const execution_time = Date.now() + '';
  const privateKeyHex = 'dlwlwhdls';

  try {
    // User-Data-Here
    const privateKey = KEYUTIL.getKey(privateKeyHex);

    // Sign
    const s_sig = new Signature({ alg: 'SHA256withECDSA' });
    s_sig.init(privateKey);
    s_sig.updateString(execution_time);
    const signature = s_sig.sign();

    console.log('data:', execution_time);
    console.log('eformsign_signature:', signature);

    // 응답으로 서명 데이터 반환
    res.status(200).json({ execution_time, signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서명 생성 중 오류가 발생했습니다.' });
  }
}
