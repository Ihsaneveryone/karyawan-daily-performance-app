const API_KEY = 'AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c';
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';

async function checkData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/indicators?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values || [];
  
  console.log('📊 INDICATORS TAB - Total rows:', rows.length);
  console.log('Header:', rows[0]);
  
  const a336 = rows.slice(1).filter(r => r[0] === 'A336');
  console.log('\n✅ A336 indicators:', a336.length);
  
  if (a336.length > 0) {
    console.log('\nA336 Data:');
    a336.forEach((row, i) => {
      console.log(`${i+1}. ${row[2]} (${row[1]}) - Target: ${row[4] || row[5]} - Weight: ${row[6]}%`);
    });
  } else {
    console.log('\n❌ NO DATA FOR A336 - User needs to paste data!');
  }
}

checkData().catch(e => console.error('Error:', e.message));
