
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* NAV scroll state */
  var nav = document.getElementById('siteNav');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  }, {passive:true});

  /* Mobile menu */
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');
  var mpClose = document.getElementById('mpClose');
  function closePanel(){ panel.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
  burger.addEventListener('click', function(){
    panel.classList.add('open'); burger.setAttribute('aria-expanded','true');
  });
  mpClose.addEventListener('click', closePanel);
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closePanel); });

  /* Hero entrance */
  var heroVideo = document.getElementById('heroVideo');
  heroVideo.addEventListener('loadeddata', function(){ heroVideo.classList.add('loaded'); });
  window.addEventListener('load', function(){
    var els = document.querySelectorAll('[data-hero]');
    els.forEach(function(el, i){
      setTimeout(function(){
        el.style.transition = 'opacity 1s cubic-bezier(.22,.61,.36,1), transform 1s cubic-bezier(.22,.61,.36,1)';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, reduceMotion ? 0 : 200 + i*160);
    });
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .story-media');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:0.14, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* Animated numbers */
  function animateCount(el, target, prefix, duration){
    if(reduceMotion){ el.textContent = prefix + target.toLocaleString(); return; }
    var start = 0; var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts-startTime)/duration, 1);
      var eased = 1 - Math.pow(1-progress, 3);
      var val = Math.floor(eased * target);
      el.textContent = prefix + val.toLocaleString();
      if(progress < 1){ requestAnimationFrame(step); } else { el.textContent = prefix + target.toLocaleString(); }
    }
    requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll('[data-count]');
  var priceEls = document.querySelectorAll('[data-count-px]');
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          if(el.hasAttribute('data-count')){ animateCount(el, parseInt(el.getAttribute('data-count'),10), '', 1000); }
          if(el.hasAttribute('data-count-px')){ animateCount(el, parseInt(el.getAttribute('data-count-px'),10), '₦', 1200); }
          io2.unobserve(el);
        }
      });
    }, {threshold:0.5});
    countEls.forEach(function(el){ io2.observe(el); });
    priceEls.forEach(function(el){ io2.observe(el); });
  }

  /* Lookbook: fetch outfits.json (editable via /admin) and render cards + lightbox + swatches */
  var lookScroller = document.getElementById('lookScroller');
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCat = document.getElementById('lbCat');
  var lbName = document.getElementById('lbName');
  var lbPrice = document.getElementById('lbPrice');
  var lbDesc = document.getElementById('lbDesc');
  var lbOrder = document.getElementById('lbOrder');
  var DEFAULT_PRICE = "₦25,000 – ₦100,000";

  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function openLook(outfit){
    var displayName = outfit.lightboxName || outfit.name;
    lbImg.src = outfit.image; lbImg.alt = outfit.alt || displayName;
    lbCat.textContent = (outfit.category || '').toUpperCase();
    lbName.textContent = displayName;
    lbPrice.textContent = outfit.price || DEFAULT_PRICE;
    lbDesc.textContent = outfit.description || '';
    lbOrder.href = "https://wa.me/2349137202959?text=" + encodeURIComponent("Hi Pillarsluxury, I'd like to order the " + displayName + ".");
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLook(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lbClose').addEventListener('click', closeLook);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLook(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLook(); });

  function renderOutfits(outfits){
    if(!lookScroller) return;
    lookScroller.innerHTML = '';
    outfits.forEach(function(outfit){
      var card = document.createElement('div');
      card.className = 'look-card';

      var tagText = escapeHtml((outfit.category || '').toUpperCase());
      var priceText = escapeHtml(outfit.price || DEFAULT_PRICE);

      var swatchHtml = '';
      if(outfit.variants && outfit.variants.length){
        swatchHtml = '<div class="swatch-row">' + outfit.variants.map(function(v, i){
          return '<span class="swatch' + (i === 0 ? ' active' : '') + '" style="background:' + escapeHtml(v.color || '#cccccc') + '" data-img="' + escapeHtml(v.image) + '" data-name="' + escapeHtml(v.name || '') + '"></span>';
        }).join('') + '</div>';
      }

      card.innerHTML =
        '<div class="lc-img-wrap"><span class="lc-tag">' + tagText + '</span>' +
        '<img src="' + escapeHtml(outfit.image) + '" alt="' + escapeHtml(outfit.alt || outfit.name) + '" loading="lazy">' +
        '<div class="lc-expand">↗</div></div>' +
        '<div class="lc-info"><h3>' + escapeHtml(outfit.name) + '</h3>' +
        '<div class="lc-price">' + priceText + '</div>' + swatchHtml + '</div>';

      var img = card.querySelector('.lc-img-wrap img');
      img.style.transition = 'opacity .18s ease';

      card.addEventListener('click', function(){ openLook(outfit); });

      if(outfit.variants && outfit.variants.length){
        var swEls = card.querySelectorAll('.swatch');
        swEls.forEach(function(sw){
          sw.addEventListener('click', function(e){
            e.stopPropagation();
            swEls.forEach(function(s){ s.classList.remove('active'); });
            sw.classList.add('active');
            img.style.opacity = 0;
            setTimeout(function(){
              img.src = sw.getAttribute('data-img');
              img.style.opacity = 1;
            }, 180);
          });
        });
      }

      lookScroller.appendChild(card);
    });
  }

  fetch('content/outfits.json')
    .then(function(r){ return r.json(); })
    .then(function(data){ renderOutfits(data.outfits || []); })
    .catch(function(err){ console.error('Pillarsluxury: could not load content/outfits.json', err); });

  /* Currency converter — approximate, manually-set rates (NGN per 1 unit), Sept 2026 */
  var rates = { USD: 1350, GBP: 1730, EUR: 1450, CAD: 985 };
  var symbols = { USD:'$', GBP:'£', EUR:'€', CAD:'CA$' };
  var currencySelect = document.getElementById('currencySelect');
  var nairaInput = document.getElementById('nairaInput');
  var convResult = document.getElementById('convResult');
  function updateConversion(){
    var amount = parseFloat(nairaInput.value) || 0;
    var cur = currencySelect.value;
    var val = amount / rates[cur];
    convResult.textContent = symbols[cur] + val.toLocaleString(undefined, {maximumFractionDigits:2});
  }
  currencySelect.addEventListener('change', updateConversion);
  nairaInput.addEventListener('input', updateConversion);
  updateConversion();

  /* Footer year */
  document.getElementById('yearNow').textContent = new Date().getFullYear();

  /* Custom CTA -> whatsapp with custom-made message, scrolls to note as fallback */
  document.getElementById('customCta').addEventListener('click', function(e){
    e.preventDefault();
    window.open("https://wa.me/2349137202959?text=" + encodeURIComponent("Hi Pillarsluxury, I'd like to start a custom-made order and share my measurements."), "_blank", "noopener");
  });

})();
