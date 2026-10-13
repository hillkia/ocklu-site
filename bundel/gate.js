/* OCKLU Membership gate — kunci lisensi Gumroad, diverifikasi langsung ke api.gumroad.com (tanpa server kita).
   Soft gate: menutup tampilan untuk pengunjung tanpa kunci. BUKAN enkripsi — isi halaman statis tetap ada di sumber HTML. */
(function () {
  var PRODUCT_ID = "FNoJ_3HqLAuiehJBWsXqVg==";
  var BUY = "https://hillkia.gumroad.com/l/ocklu-membership";
  var LS = "ocklu_member_v1", FRESH = 12 * 3600e3, GRACE = 7 * 864e5;
  var id = (navigator.language || "en").toLowerCase().indexOf("id") === 0;
  var T = id ? {
    h: "Alat ini khusus anggota", p: "OCKLU Membership: semua alat, $3/bulan (ditagih $9 tiap 3 bulan, minimal 3 bulan). Sudah beli? Tempel kunci lisensi dari email/halaman Gumroad.",
    ph: "Kunci lisensi", go: "Masuk", buy: "Jadi anggota", chk: "Memeriksa…", bad: "Kunci tidak valid atau langganan sudah berakhir.",
    net: "Tidak bisa menghubungi Gumroad. Coba lagi.", out: "Keluar", note: "Ojol & Lingkarin tidak termasuk (skema sendiri)."
  } : {
    h: "Members-only tool", p: "OCKLU Membership: every tool, $3/month (billed $9 every 3 months, 3-month minimum). Already a member? Paste the license key from your Gumroad email or content page.",
    ph: "License key", go: "Unlock", buy: "Become a member", chk: "Checking…", bad: "Invalid key, or the membership has ended.",
    net: "Could not reach Gumroad. Try again.", out: "Sign out", note: "Ojol & Lingkarin are not included (own scheme)."
  };
  function rd() { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { return null; } }
  function wr(v) { try { v ? localStorage.setItem(LS, JSON.stringify(v)) : localStorage.removeItem(LS); } catch (e) {} }
  function aktif(r) {
    var p = r && r.success && r.purchase; if (!p) return false;
    return !p.refunded && !p.chargebacked && !p.subscription_ended_at && !p.subscription_failed_at;
  }
  function cek(key) {
    var b = "product_id=" + encodeURIComponent(PRODUCT_ID) + "&license_key=" + encodeURIComponent(key) + "&increment_uses_count=false";
    return fetch("https://api.gumroad.com/v2/licenses/verify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: b })
      .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (j) { return { ok: aktif(j), net: false }; }, function () { return { ok: false, net: true }; });
  }
  var ov;
  function tutup() { if (ov) { ov.remove(); ov = null; } document.documentElement.style.overflow = ""; }
  function buka(pesan) {
    if (ov) { ov.querySelector("[data-m]").textContent = pesan || ""; return; }
    document.documentElement.style.overflow = "hidden";
    ov = document.createElement("div");
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,12,18,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    ov.innerHTML = '<div style="max-width:420px;width:100%;background:#16213e;color:#e8ecf4;border:1px solid rgba(0,212,255,.35);border-radius:12px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.5)">' +
      '<div style="font-size:12px;letter-spacing:.12em;color:#00d4ff">OCKLU MEMBERSHIP</div>' +
      '<h2 style="margin:6px 0 8px;font-size:20px;color:#fff">' + T.h + '</h2><p style="margin:0 0 14px;color:#b8c2d6">' + T.p + '</p>' +
      '<form data-f style="display:flex;gap:8px;flex-wrap:wrap"><input data-k type="text" autocomplete="off" spellcheck="false" placeholder="' + T.ph + '" style="flex:1;min-width:180px;padding:10px 12px;border-radius:8px;border:1px solid #3a4a73;background:#0d1426;color:#fff;font-size:15px">' +
      '<button type="submit" style="padding:10px 16px;border:0;border-radius:8px;background:#00d4ff;color:#06101f;font-weight:600;font-size:15px;cursor:pointer">' + T.go + '</button></form>' +
      '<div data-m role="alert" style="min-height:20px;margin-top:8px;color:#ff9f7a;font-size:13px"></div>' +
      '<a href="' + BUY + '" style="display:inline-block;margin-top:4px;color:#00d4ff">' + T.buy + ' →</a>' +
      '<div style="margin-top:12px;color:#7d89a6;font-size:12px">' + T.note + '</div></div>';
    document.body.appendChild(ov);
    var m = ov.querySelector("[data-m]"), k = ov.querySelector("[data-k]"); m.textContent = pesan || "";
    ov.querySelector("[data-f]").addEventListener("submit", function (e) {
      e.preventDefault(); var v = k.value.trim(); if (!v) return; m.style.color = "#b8c2d6"; m.textContent = T.chk;
      cek(v).then(function (r) {
        if (r.ok) { wr({ k: v, t: Date.now(), v: Date.now() }); tutup(); badge(); }
        else { m.style.color = "#ff9f7a"; m.textContent = r.net ? T.net : T.bad; }
      });
    });
    setTimeout(function () { try { k.focus(); } catch (e) {} }, 50);
  }
  function badge() {
    if (document.getElementById("ocklu-member-badge")) return;
    var b = document.createElement("button"); b.id = "ocklu-member-badge"; b.type = "button"; b.textContent = "✓ Member · " + T.out;
    b.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:2147482000;padding:4px 10px;border-radius:999px;border:1px solid rgba(0,212,255,.35);background:rgba(22,33,62,.9);color:#9fdcf0;font:12px -apple-system,sans-serif;cursor:pointer;opacity:.7";
    b.onclick = function () { wr(null); location.reload(); };
    document.body.appendChild(b);
  }
  function mulai() {
    var s = rd();
    if (s && s.k) {
      if (Date.now() - s.v < FRESH) { badge(); return; }
      cek(s.k).then(function (r) {
        if (r.ok) { s.v = Date.now(); wr(s); badge(); }
        else if (r.net && Date.now() - s.v < GRACE) { badge(); }   // Gumroad tak terjangkau: anggota tidak diusir
        else { wr(null); buka(T.bad); }
      });
      return;
    }
    buka("");
  }
  if (document.body) mulai(); else document.addEventListener("DOMContentLoaded", mulai);
})();
