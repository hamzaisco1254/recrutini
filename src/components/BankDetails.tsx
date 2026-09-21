import { BANK } from "@/lib/brand";
import { BANK_LABELS, t, type Locale } from "@/lib/i18n";

/** Group a long account number so it can be read off the screen without slipping. */
function group(digits: string, size = 4) {
  return digits.replace(new RegExp(`(.{${size}})`, "g"), "$1 ").trim();
}

const MONO = new Set(["RIB", "IBAN", "SWIFT / BIC"]);

/**
 * Bank transfer details. Shown only where a candidate has an amount to pay —
 * their own file page and the payment page — never on the public landing page.
 */
export default function BankDetails({
  amountDt,
  reference,
  locale = "en",
}: {
  amountDt?: number;
  reference?: string;
  locale?: Locale;
}) {
  const labels = t(locale).status.bank;
  const rows: [string, string][] = BANK_LABELS[locale].map(([k, v]) => [
    k,
    k === "RIB" ? group(BANK.rib) : k === "IBAN" ? group(BANK.iban) : v,
  ]);
  if (typeof amountDt === "number") rows.unshift([labels.amount, `${amountDt} dt`]);
  if (reference) rows.push([labels.reference, reference]);

  return (
    <div className="bank">
      {rows.map(([k, v]) => (
        <div className="bank-row" key={k}>
          <span className="bank-key">{k}</span>
          <span className={MONO.has(k) ? "bank-val mono" : "bank-val"}>{v}</span>
        </div>
      ))}
    </div>
  );
}
