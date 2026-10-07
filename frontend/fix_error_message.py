jsx_path = 'c:/Users/dell/meta/frontend/src/pages/Dashboard.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

# Change state definition
jsx = jsx.replace('const [showError, setShowError] = useState(false);', 'const [showError, setShowError] = useState(false);\n  const [errorMsg, setErrorMsg] = useState("You must connect your Meta Ads account before creating a new campaign.");')

# Change handleConnectMeta failure
import re
jsx = re.sub(r'\} else \{\s*setShowError\(true\);\s*\}', '} else { setShowError(true); setErrorMsg(data.message || "Failed to connect to Meta"); }', jsx)
jsx = re.sub(r'catch \(err\) \{\s*console.error\(err\);\s*setShowError\(true\);\s*\}', 'catch (err) { console.error(err); setShowError(true); setErrorMsg(err.message || "Network error"); }', jsx)

# Change handleNewCampaign
jsx = re.sub(r'\} else \{\s*setShowError\(true\);\s*setTimeout\(\(\) => setShowError\(false\), 3000\);\s*\}', '} else { setShowError(true); setErrorMsg("You must connect your Meta Ads account before creating a new campaign."); setTimeout(() => setShowError(false), 3000); }', jsx)

# Change JSX rendering
jsx = jsx.replace('<p>You must connect your Meta Ads account before creating a new campaign.</p>', '<p>{errorMsg}</p>')

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)
