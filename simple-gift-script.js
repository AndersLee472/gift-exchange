let participants = [];
let assignments = {};
let currentUser = '我';

const participantNameInput = document.getElementById('participant-name');
const addParticipantBtn = document.getElementById('add-participant-btn');
const participantsGrid = document.getElementById('participants-grid');
const startMatchBtn = document.getElementById('start-match-btn');
const assignedNameEl = document.getElementById('assigned-name');

addParticipantBtn.addEventListener('click', addParticipant);
participantNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addParticipant();
    }
});

function addParticipant() {
    const name = participantNameInput.value.trim() || '我';

    if (participants.includes(name)) {
        alert('这个名字已经存在！');
        return;
    }

    participants.push(name);
    participantNameInput.value = '';
    renderParticipants();
}

function renderParticipants() {
    participantsGrid.innerHTML = '';

    participants.forEach((name, index) => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.innerHTML = `
            <div class="participant-name">${name}</div>
            ${name !== '我' ? '<div class="participant-remove" data-index="' + index + '">移除</div>' : ''}
        `;

        if (name !== '我') {
            card.querySelector('.participant-remove').addEventListener('click', (e) => {
                removeParticipant(index);
            });
        }

        participantsGrid.appendChild(card);
    });
}

function removeParticipant(index) {
    participants.splice(index, 1);
    renderParticipants();
}

startMatchBtn.addEventListener('click', () => {
    if (participants.length < 2) {
        assignedNameEl.textContent = '至少需要2个参与者！';
        return;
    }

    // Shuffle participants for random assignment
    const shuffled = [...participants].sort(() => Math.random() - 0.5);

    // Create assignments (each person gives to the next person, last gives to first)
    assignments = {};
    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        assignments[giver] = receiver;
    }

    // Display assignment for current user
    if (currentUser && assignments[currentUser]) {
        // Animate the reveal
        startMatchBtn.disabled = true;
        startMatchBtn.innerHTML = '<span>匹配中...</span>';

        setTimeout(() => {
            assignedNameEl.style.opacity = '0';
            setTimeout(() => {
                assignedNameEl.textContent = assignments[currentUser];
                assignedNameEl.style.opacity = '1';
                startMatchBtn.disabled = false;
                startMatchBtn.innerHTML = '<span>重新匹配</span>';
            }, 300);
        }, 1000);

        // Show confetti effect
        createConfetti();
    } else {
        alert('请先添加自己为参与者！');
    }
});

function createConfetti() {
    const colors = ['#D4AF37', '#B81D47', '#F4E4C1', '#8B1538'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.transition = 'transform 3s ease-out, opacity 3s ease-out';

        document.body.appendChild(confetti);

        const x = (Math.random() - 0.5) * 200;
        const y = window.innerHeight + 100;

        setTimeout(() => {
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Add hover effects to gift boxes
document.querySelectorAll('.gift-box').forEach((gift, index) => {
    gift.addEventListener('click', () => {
        gift.classList.add('shake');
        setTimeout(() => {
            gift.classList.remove('shake');
        }, 500);
    });
});

// Load page
window.addEventListener('DOMContentLoaded', () => {
    // Add current user as first participant
    if (!participants.includes('我')) {
        addParticipant.call({ value: '我' });
        participantNameInput.value = '';
    }
});
