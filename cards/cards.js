const suitRenderDetails = {
    S: { value: '♠', color: 'black' },
    H: { value: '♥', color: 'red' },
    D: { value: '♦', color: 'red' },
    C: { value: '♣', color: 'black' },
    none: { value: '', color: '', joker: true }
};

function renderPips(rank, suit) {
    if (['J', 'Q', 'K', 'Joker'].includes(rank)) {
        return `<div class="pip"><img src="cards/${rank}${suit}.svg" width=70 /></div>`;
    }
    let count = (rank === 'A') ? 1 : parseInt(rank, 10)
    return `<div class="pip">${suit}</div>`.repeat(count);
}


export default function renderCard(card) {
    let suit = suitRenderDetails[card.at(-1)] || suitRenderDetails.none;
    let rank = suit.joker ? "Joker" : card.slice(0, -1);

    return `
            <div class="card ${suit.color} rank-${rank.toLowerCase()}">
                <div class="card-corner top-left">${rank}<br/>${suit.value}</div>
                <div class="card-middle">${renderPips(rank, suit.value)}</div>
                <div class="card-corner bottom-right">${rank}<br/>${suit.value}</div>
            </div>`;
}

