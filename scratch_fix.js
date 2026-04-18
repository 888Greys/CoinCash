const fs = require('fs');
let code = fs.readFileSync('components/wallet-action-drawer.tsx', 'utf8');

const brokenP1 = '            <button\r\n              className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"\r\n\r\n            {!!selectedWallet && (';
const brokenP2 = '            <button\n              className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"\n\n            {!!selectedWallet && (';

let toReplace = code.includes(brokenP1) ? brokenP1 : (code.includes(brokenP2) ? brokenP2 : null);

if(!toReplace) {
  console.log('Error: Could not find the text to replace.');
  process.exit(1);
}

const replacement = `            <button
              className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              onClick={closeDrawer}
              aria-label="Close panel"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* ── Transfer Success Confirmation ── */}
          {transferSuccess ? (
            <div className="flex flex-col items-center px-6 pt-10 pb-6 h-[calc(100%-64px)] overflow-y-auto">
              <div className="relative w-20 h-20 mb-5">
                <div className="absolute inset-0 rounded-full bg-[#2ecc71]/15 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2ecc71] to-[#27ae60] flex items-center justify-center shadow-lg shadow-[#2ecc71]/25">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                </div>
              </div>

              <h3 className="font-headline text-lg font-bold text-on-surface mb-1">Payment Successful</h3>
              <p className="text-3xl font-bold text-on-surface mb-1 font-headline">
                {transferSuccess.amount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {" "}
                <span className="text-primary">{transferSuccess.currency}</span>
              </p>
              <p className="text-xs text-on-surface-variant text-center mb-8">
                The recipient can check the balance in the Funding Account
              </p>

              <div className="w-full border-t border-outline-variant/15 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">To</span>
                  <span className="text-sm font-semibold text-on-surface">{transferSuccess.recipientLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Order ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-on-surface">{transferSuccess.reference.slice(0, 22)}</span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(transferSuccess.reference);
                        setFeedback({ type: "success", message: "Copied!" });
                        setTimeout(() => setFeedback(null), 2000);
                      }}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Payment Method</span>
                  <span className="text-sm font-semibold text-on-surface">Funding Account</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Paid With</span>
                  <span className="text-sm font-semibold text-on-surface">
                    {transferSuccess.amount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {transferSuccess.currency}
                  </span>
                </div>
              </div>

              {feedback && (
                <div className={\`mt-4 w-full rounded-sm border px-3 py-2 text-xs \${
                  feedback.type === 'error'
                    ? 'border-error/40 bg-error/10 text-error'
                    : 'border-primary/30 bg-primary/10 text-primary'
                }\`}>
                  {feedback.message}
                </div>
              )}

              <button
                onClick={() => {
                  setTransferSuccess(null);
                  setFeedback(null);
                  setTransferAmount("");
                  setTransferRecipient("");
                }}
                className="mt-auto w-full py-3.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-sm rounded-sm hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Send Another Transaction
              </button>
            </div>
          ) : (
          <div className="p-5 space-y-4">
            {wallets.length === 0 && (
              <div className="rounded-sm border border-outline-variant/20 bg-surface-container-highest p-4 text-sm text-on-surface-variant">
                No wallets are available yet. Please refresh shortly after account initialization.
              </div>
            )}

            {!!selectedWallet && (`.replace(/\n/g, toReplace === brokenP1 ? '\r\n' : '\n');

code = code.replace(toReplace, replacement);

const endTargetP1 = '          </div>\r\n        </aside>';
const endTargetP2 = '          </div>\n        </aside>';
let endTarget = code.includes(endTargetP1) ? endTargetP1 : (code.includes(endTargetP2) ? endTargetP2 : null);

if(!endTarget) {
  console.log('Error: Could not find end target.');
  process.exit(1);
}

const endReplacement = \`          </div>
          )}
        </aside>\`.replace(/\n/g, endTarget === endTargetP1 ? '\r\n' : '\n');

code = code.replace(endTarget, endReplacement);

fs.writeFileSync('components/wallet-action-drawer.tsx', code, 'utf8');
console.log('Success: Replaced drawer content.');
