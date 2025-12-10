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
export default function evaluateHand(cards){
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
  let availableJokers = jokers;
  for(let r=12;r>=0;r--){
    const have = rc[r]||0;
    if(have + availableJokers >= 2) {
      pairRanks.push(r);
      availableJokers--;
    }
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