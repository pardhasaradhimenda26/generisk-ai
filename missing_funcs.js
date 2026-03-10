function mountRings(analysisData) {
    var grid = document.getElementById('rings-grid');
    if (!grid) return;
    grid.innerHTML = '';

    analysisData.riskScores.forEach(function (item) {
      var rc = riskClass(item.pct);
      var Rr = 32;
      var circ = 2 * Math.PI * Rr;
      var targetOffset = circ * (1 - item.pct / 100);
      var div = document.createElement('div');
      div.className = 'ring-item';
      div.innerHTML =
        '<div class="ring-svg-wrap">' +
        '<svg class="ring-svg" viewBox="0 0 80 80">' +
        '<circle class="ring-track" cx="40" cy="40" r="' + Rr + '"/>' +
        '<circle class="ring-fill ring-' + rc + '" cx="40" cy="40" r="' + Rr + '"' +
        ' stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '" data-offset="' + targetOffset + '"/>' +
        '</svg>' +
        '<div class="ring-label-center"><span class="ring-pct pct-' + rc + '">' + item.pct + '%</span></div>' +
        '</div><span class="ring-name">' + item.name + '</span>';
      grid.appendChild(div);
    });

    var section = document.getElementById('results');
    var ringsAnimated = false;

    
function mountMutationsTable(analysisData) {
    var tbody = document.getElementById('mutations-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (analysisData.mutationDetails.length === 0) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4" style="text-align:center;opacity:0.5;padding:1.5rem 0;">No mutations detected \u2014 baseline risk profile shown</td>';
      tbody.appendChild(tr);
      return;
    }

    analysisData.mutationDetails.forEach(function (row) {
      var rc = row.risk === 'HIGH' ? 'high' : row.risk === 'MEDIUM' ? 'mid' : 'low';
      var geneColor = rc === 'high' ? '#FCA5A5' : rc === 'mid' ? '#FDE68A' : '#6EE7B7';
      var tr = document.createElement('tr');
      tr.className = 'row-' + rc;
      tr.innerHTML =
        '<td><span class="mt-gene" style="color:' + geneColor + '">' + row.gene + '</span></td>' +
        '<td><span class="mt-type">' + row.type + '</span></td>' +
        '<td><span class="mt-badge" style="' + badgeStyle(row.risk) + '">' + row.risk + '</span></td>' +
        '<td><span class="mt-cancer">' + row.cancer + '</span></td>';
      tbody.appendChild(tr);
    });
  }

  /* ─── 4. Typewriter ───────────────────────────────────── */
  
function runTypewriter(text) {
    var el = document.getElementById('ai-typewriter');
    if (!el) return;
    el.textContent = '';
    el.classList.remove('ai-error-msg', 'ai-loading-pulse', 'done');
    var idx = 0;
    var iv = setInterval(function () {
      if (idx < text.length) { el.textContent = text.slice(0, idx + 1); idx++; }
      else { clearInterval(iv); el.classList.add('done'); }
    }, 18);
  }

  /* ─── AI card states ─────────────────────────────────── */
  