const RANKS = "23456789TJQKA";
const RVAL = Object.fromEntries([...RANKS].map((r,i)=>[r,i]));
const SUITS = [..."CDHS"];
const JOKER = "JK";

function parse(card){ return card===JOKER ? {j:1} : {r:card[0],s:card[1]}; }
function tally(cards){
  const rc = {}, sc = {}, parsed = [], res = {ranks:rc, suits:sc, jokers:0, parsed};
  for(const c of cards){
    const p = parse(c);
    parsed.push(p);
    if(p.j) res.jokers++;
    else { rc[p.r] = (rc[p.r]||0)+1; sc[p.s] = (sc[p.s]||0)+1; }
  }
  return res;
}
function uniqSortedRanks(cards){
  return [...new Set(cards.map(c=>c.r).filter(Boolean).map(r=>RVAL[r]))].sort((a,b)=>a-b);
}
function hasStraightFromVals(vals, jokers){
  // vals: array of numeric ranks (0-12). Return {ok, high}
  const u = [...new Set(vals)].sort((a,b)=>a-b);
  // try windows 0..8 then wheel
  for(let start=0; start<=8; start++){
    let have=0;
    for(let k=0;k<5;k++) if(u.includes(start+k)) have++;
    if(5-have <= jokers) return {ok:true, high:start+4};
  }
  // wheel A2345 (12,0,1,2,3)
  const needWheel = [12,0,1,2,3].filter(x=>!u.includes(x)).length;
  if(needWheel <= jokers) return {ok:true, high:3};
  return {ok:false};
}

// Compare candidate category priority
const CATEGORY_PRIORITY = {
  "Five of a Kind": 10,
  "Royal Flush": 9,
  "Straight Flush": 8,
  "Four of a Kind": 7,
  "Full House": 6,
  "Flush": 5,
  "Straight": 4,
  "Three of a Kind": 3,
  "Two Pair": 2,
  "Pair": 1,
  "High Card": 0
};

// Evaluate made hand (7 or fewer cards). Jokers are full wildcards.
export function evaluateMadeHand(cards){
  const t = tally(cards);
  const rc = Object.fromEntries(Object.entries(t.ranks||{}).map(([k,v])=>[RVAL[k],v]));
  const sc = t.suits || {};
  const jokers = t.jokers;
  const vals = Object.keys(rc).map(k=>+k);
  // helper to check N-of-a-kind with jokers
  const bestOfKind = (need) => {
    for(let r=12; r>=0; r--){
      const have = rc[r] || 0;
      if(have + jokers >= need) return {ok:true, rank:r, need:Math.max(0, need - have)};
    }
    return {ok:false};
  };

  // Five of a kind
  const five = bestOfKind(5);
  if(five.ok) return { category:"Five of a Kind", rank:RANKS[five.rank], detail: five };

  // Straight Flush / Royal Flush
  for(const suit of SUITS){
    // collect ranks of this suit (non-joker)
    const suitVals = [];
    for(const c of cards){
      if(c===JOKER) continue;
      if(c[1]===suit) suitVals.push(RVAL[c[0]]);
    }
    const sf = hasStraightFromVals(suitVals, jokers);
    if(sf.ok){
      if(sf.high===12) return { category:"Royal Flush", suit };
      return { category:"Straight Flush", suit, highRank:RANKS[sf.high] };
    }
  }

  // Four of a kind
  const four = bestOfKind(4);
  if(four.ok){
    // kicker
    const allVals = [];
    for(const c of cards) if(c!==JOKER) allVals.push(RVAL[c[0]]);
    // if jokers used to make quad, remove quad rank instances up to used to compute kicker
    const kickerCandidates = allVals.filter(v=>v!==four.rank);
    const kicker = kickerCandidates.length ? Math.max(...kickerCandidates) : null;
    return { category:"Four of a Kind", rank:RANKS[four.rank], kicker: kicker===null?null:RANKS[kicker] };
  }

  // Full House (trip + pair). Consider jokers flexibly.
  // Try to form trip first (highest), then pair
  const tripCandidates = [];
  for(let r=12;r>=0;r--){
    const have = rc[r]||0;
    if(have + jokers >= 3) tripCandidates.push(r);
  }
  for(const trip of tripCandidates){
    // consume required jokers for trip
    const needForTrip = Math.max(0, 3 - (rc[trip]||0));
    const jokersLeft = Math.max(0, jokers - needForTrip);
    // try to find pair among others
    for(let p=12; p>=0; p--){
      if(p===trip) continue;
      const haveP = rc[p]||0;
      if(haveP + jokersLeft >=2) return { category:"Full House", trip:RANKS[trip], pair:RANKS[p] };
    }
    // or another trip can serve as pair (if two trips present)
    for(let p=12;p>=0;p--){
      if(p===trip) continue;
      if(rc[p] >= 3) return { category:"Full House", trip:RANKS[trip], pair:RANKS[p] };
    }
  }

  // Flush
  for(const s of SUITS){
    const have = sc[s] || 0;
    if(have + jokers >= 5){
      // identify highest flush card (considering jokers can be Ace)
      const suitVals = [];
      for(const c of cards) if(c!==JOKER && c[1]===s) suitVals.push(RVAL[c[0]]);
      const high = suitVals.length ? Math.max(...suitVals) : 12; // jokers could make Ace
      return { category:"Flush", suit:s, highCard:RANKS[high] };
    }
  }

  // Straight (any suits)
  const allVals = [];
  for(const c of cards) if(c!==JOKER) allVals.push(RVAL[c[0]]);
  const st = hasStraightFromVals(allVals, jokers);
  if(st.ok) return { category:"Straight", highCard:RANKS[st.high] };

  // Three of a kind
  const three = bestOfKind(3);
  if(three.ok) {
    // kickers
    const remainingVals = allVals.filter(v=>v!==three.rank).sort((a,b)=>b-a).slice(0,2);
    return { category:"Three of a Kind", rank:RANKS[three.rank], kickers: remainingVals.map(v=>RANKS[v]) };
  }

  // Two Pair
  // find two distinct ranks that can each reach 2 with jokers split across them
  const pairRanks = [];
  for(let r=12;r>=0;r--){
    const have = rc[r]||0;
    if(have + jokers >= 2) pairRanks.push(r);
  }
  if(pairRanks.length >= 2){
    const top2 = pairRanks.slice(0,2);
    // kicker:
    const otherVals = allVals.filter(v=>!top2.includes(v)).sort((a,b)=>b-a);
    return { category:"Two Pair", topPair:RANKS[top2[0]], secondPair:RANKS[top2[1]], kicker: otherVals.length?RANKS[otherVals[0]]:null };
  }

  // Pair
  for(let r=12;r>=0;r--){
    const have = rc[r]||0;
    if(have + jokers >= 2) {
      const kickers = allVals.filter(v=>v!==r).sort((a,b)=>b-a).slice(0,3);
      return { category:"Pair", rank:RANKS[r], kickers:kickers.map(v=>RANKS[v]) };
    }
  }

  // High Card
  const sorted = allVals.sort((a,b)=>b-a);
  const high = sorted.length ? sorted[0] : (jokers ? 12 : null);
  return { category:"High Card", highCard: high===null?null:RANKS[high], kickers: sorted.slice(1,5).map(v=>RANKS[v]) };
}

// POSSIBILITIES using remaining deck counts
export default function possibleHands(cards, remaining){
  // remaining shape expected:
  // { ranks: { "A":n,... }, suits: { c:n,d:n,h:n,s:n }, byRankSuit: { "A":{c:n,...}, ... }, jokers: n }
  const t = tally(cards);
  const haveRanks = Object.assign({}, t.ranks);
  const haveSuits = Object.assign({}, t.suits);
  const haveJokers = t.jokers;
  const deckJokers = (remaining && remaining.jokers) || 0;

  const totalAvailableRank = r => (remaining.ranks && (remaining.ranks[r]||0)) || 0;
  const totalAvailableSuit = s => (remaining.suits && (remaining.suits[s]||0)) || 0;
  const availableByRankSuit = (r,s) => (remaining.byRankSuit && (remaining.byRankSuit[r]||{})[s]) || 0;

  const draws = 7 - cards.length;
  // if draws <= 0, nothing future possible
  if(draws <= 0) {
    return { current: evaluateMadeHand(cards), possible: {} };
  }

  // helper: check if need <= availInDeck + deckJokers + (jokers in hand can be reused? no: hand jokers already in hand)
  const canObtain = (need, avail) => need <= (avail + deckJokers);

  // Five of a Kind possibility
  const fiveOpts = [];
  for(const r of RANKS){
    const have = haveRanks[r]||0;
    const need = Math.max(0, 5 - have);
    // cannot use hand jokers as "remaining" supply; they already counted in have
    // available in deck for that rank:
    const avail = totalAvailableRank(r);
    if(need <= avail + deckJokers && need <= draws + deckJokers) fiveOpts.push({rank:r, need, avail});
  }

  // Straight flush / Royal flush possibility: check each suit and each 5-length window
  const sfOpts = [];
  for(const s of SUITS){
    // collect present ranks in that suit from hand
    const present = new Set();
    for(const c of cards){
      if(c===JOKER) continue;
      if(c[1]===s) present.add(RVAL[c[0]]);
    }
    // windows
    for(let start=0; start<=8; start++){
      const window = [start,start+1,start+2,start+3,start+4];
      let missing = [];
      for(const r of window){
        if(!present.has(r)) {
          const rankChar = RANKS[r];
          const avail = availableByRankSuit(rankChar, s);
          if(avail>0) missing.push({rank:rankChar, suit:s, avail});
          else missing.push({rank:rankChar, suit:s, avail:0});
        }
      }
      const need = missing.length;
      // jokers in deck can supply some; also we may already have hand jokers counted in present? hand jokers are in cards and already counted as haveJokers so they reduce missing
      // But here we treat hand jokers as already present (they can be used immediately) so effective need is need - handJokersUsed, where handJokersUsed = min(haveJokers, need)
      const needAfterHandJokers = Math.max(0, need - haveJokers);
      // deck availability:
      const availInDeck = missing.reduce((s, m)=> s + m.avail, 0);
      if(needAfterHandJokers <= availInDeck + deckJokers && needAfterHandJokers <= draws + deckJokers) {
        const isRoyal = window.every(r=> [8,9,10,11,12].includes(r));
        sfOpts.push({ suit:s, window: window.map(r=>RANKS[r]), need, availInDeck, isRoyal });
      }
    }
    // wheel (A2345)
    {
      const window = [12,0,1,2,3];
      let missing = [];
      for(const r of window){
        if(!present.has(r)){
          const rankChar = RANKS[r];
          const avail = availableByRankSuit(rankChar, s);
          missing.push({rank:rankChar,suit:s,avail});
        }
      }
      const need = missing.length;
      const needAfterHandJokers = Math.max(0, need - haveJokers);
      const availInDeck = missing.reduce((s,m)=> s+m.avail, 0);
      if(needAfterHandJokers <= availInDeck + deckJokers && needAfterHandJokers <= draws + deckJokers) {
        sfOpts.push({ suit:s, window: ["A","2","3","4","5"], need, availInDeck, isRoyal:false });
      }
    }
  }

  // Four of a Kind possibility
  const fourOpts = [];
  for(const r of RANKS){
    const have = haveRanks[r]||0;
    const need = Math.max(0, 4 - have);
    const avail = totalAvailableRank(r);
    if(need <= avail + deckJokers && need <= draws + deckJokers) fourOpts.push({rank:r, need, avail});
  }

  // Full House possibility (trip + pair)
  const fullOpts = [];
  // try all r for trip, p for pair (r!=p)
  for(const r of RANKS){
    const haveR = haveRanks[r]||0;
    const needTrip = Math.max(0, 3 - haveR);
    const availTrip = totalAvailableRank(r);
    // if impossible even with all deck jokers and draws skip
    if(needTrip > availTrip + deckJokers || needTrip > draws + deckJokers) continue;
    // remaining draws/jokers after making trip
    // we approximate feasibility: check existence of any other rank that can be pair
    for(const p of RANKS){
      if(p===r) continue;
      const haveP = haveRanks[p]||0;
      const needPair = Math.max(0, 2 - haveP);
      const availPair = totalAvailableRank(p);
      // total needed = needTrip + needPair; must be <= draws + deckJokers
      if(needTrip + needPair <= draws + deckJokers && needPair <= availPair + deckJokers) {
        fullOpts.push({trip:r, pair:p, needTrip, needPair, availTrip, availPair});
        break;
      }
    }
  }

  // Flush possibility (any suit)
  const flushOpts = [];
  for(const s of SUITS){
    const have = haveSuits[s]||0;
    const need = Math.max(0, 5 - have);
    const avail = totalAvailableSuit(s);
    if(need <= avail + deckJokers && need <= draws + deckJokers) flushOpts.push({suit:s, need, avail});
  }

  // Straight possibility (any suits)
  const straightOpts = [];
  const presentVals = uniqSortedRanks(t.parsed);
  for(let start=0; start<=8; start++){
    const window = [start,start+1,start+2,start+3,start+4];
    let missing = [];
    for(const r of window){
      if(!presentVals.includes(r)){
        const rankChar = RANKS[r];
        const avail = totalAvailableRank(rankChar);
        missing.push({rank:rankChar, avail});
      }
    }
    const need = missing.length;
    const needAfterHandJokers = Math.max(0, need - haveJokers);
    const availInDeck = missing.reduce((s,m)=> s+m.avail, 0);
    if(needAfterHandJokers <= availInDeck + deckJokers && needAfterHandJokers <= draws + deckJokers) {
      straightOpts.push({window: window.map(r=>RANKS[r]), need, availInDeck});
    }
  }
  // wheel
  {
    const window = [12,0,1,2,3];
    let missing = [];
    for(const r of window){
      if(!presentVals.includes(r)){
        const rankChar = RANKS[r];
        const avail = totalAvailableRank(rankChar);
        missing.push({rank:rankChar, avail});
      }
    }
    const need = missing.length;
    const needAfterHandJokers = Math.max(0, need - haveJokers);
    const availInDeck = missing.reduce((s,m)=> s+m.avail, 0);
    if(needAfterHandJokers <= availInDeck + deckJokers && needAfterHandJokers <= draws + deckJokers)
      straightOpts.push({window:["A","2","3","4","5"], need, availInDeck});
  }

  // Three of a Kind possibility
  const threeOpts = [];
  for(const r of RANKS){
    const have = haveRanks[r]||0;
    const need = Math.max(0, 3 - have);
    const avail = totalAvailableRank(r);
    if(need <= avail + deckJokers && need <= draws + deckJokers) threeOpts.push({rank:r, need, avail});
  }

  // Two Pair / Pair possibilities
  const pairOpts = [];
  for(const r of RANKS){
    const have = haveRanks[r]||0;
    const need = Math.max(0, 2 - have);
    const avail = totalAvailableRank(r);
    if(need <= avail + deckJokers && need <= draws + deckJokers) pairOpts.push({rank:r, need, avail});
  }
  // If there are at least two ranks where pair is possible (accounting jokers across both), then two-pair possible.
  const twoPairPossible = (() => {
    // simplified feasibility: try pairs using deck jokers limited by deckJokers
    // iterate combinations of two distinct ranks
    for(let i=0;i<RANKS.length;i++){
      for(let j=i+1;j<RANKS.length;j++){
        const r1 = RANKS[i], r2 = RANKS[j];
        const have1 = haveRanks[r1]||0, have2 = haveRanks[r2]||0;
        const need1 = Math.max(0,2-have1), need2 = Math.max(0,2-have2);
        const avail1 = totalAvailableRank(r1), avail2 = totalAvailableRank(r2);
        if(need1 <= avail1 + deckJokers && need2 <= avail2 + deckJokers && (need1+need2) <= draws + deckJokers) return true;
      }
    }
    return false;
  })();

  // Result assembly
  const current = evaluateMadeHand(cards);
  return {
    current,
    possible: [
      ...fiveOpts.map(opts => ({...opts, category: "Five of a Kind"})),
      ...sfOpts.filter(o=>o.isRoyal).map(opts => ({...opts, category: "Royal Flush"})),
      ...sfOpts.filter(o=>!o.isRoyal).map(opts => ({...opts, category: "Flush"})),
      ...fourOpts.map(opts => ({...opts, category: "Four of a Kind"})),
      ...fullOpts.map(opts => ({...opts, category: "Full House"})),
      ...flushOpts.map(opts => ({...opts, category: "Flush"})),
      ...straightOpts.map(opts => ({...opts, category: "Straight"})),
      ...threeOpts.map(opts => ({...opts, category: "Three of a Kind"})),
      ...pairOpts.map(opts => ({...opts, category: "Pair"}))
    ].filter(({need}) => draws >= need)
  };
}

// Example usage:
// const cards = ["Ah","Kh","Qh","Jk"]; // parse with evaluateMadeHand(cards)
// const remaining = {
//   ranks: {"A":6,"K":6,...}, suits: {c:24,d:24,h:24,s:24},
//   byRankSuit: { "A":{c:2,d:2,h:2,s:2}, ... }, jokers:4
// };
// console.log(evaluateMadeHand(cards));
// console.log(possibleHands(cards, remaining));