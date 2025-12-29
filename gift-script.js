let participants = [];
let assignments = {};
let currentUser = '';

const groupNameInput = document.getElementById('group-name');
const budgetSelect = document.getElementById('budget');
const eventDateInput = document.getElementById('event-date');
const createGroupBtn = document.getElementById('create-group-btn');
const participantNameInput = document.getElementById('participant-name');
const addParticipantBtn = document.getElementById('add-participant-btn');
const participantsGrid = document.getElementById('participants-grid');
const matchSection = document.getElementById('match-section');
const startMatchBtn = document.getElementById('start-match-btn');
const assignedNameEl = document.getElementById('assigned-name');

createGroupBtn.addEventListener('click', () => {
    const groupName = groupNameInput.value.trim();
    const budget = budgetSelect.value;
    const eventDate = eventDateInput.value;

    if (!groupName || !budget || !eventDate) {
        alert('请填写所有必要信息！');
        return;
    }

    // Save group info
    localStorage.setItem('groupInfo', JSON.stringify({
        name: groupName,
        budget: budget,
        date: eventDate
    }));

    // Show success message
    createGroupBtn.innerHTML = '✓ 活动创建成功！';
    createGroupBtn.style.background = 'linear, #28a-gradient(135deg745 0%, #20c997 100%)';

    // Show match section after a delay
    setTimeout(() => {
        matchSection.style.display = 'block';
        matchSection.scrollIntoView({ behavior: 'smooth' });
    }, 1500);

    // Reset button after 3 seconds
    setTimeout(() => {
        createGroupBtn.innerHTML = '<span>创建活动</span>';
        createGroupBtn.style.background = '';
    }, 3000);
});

addParticipantBtn.addEventListener('click', addParticipant);
participantNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addParticipant();
    }
});

function addParticipant() {
    const name = participantNameInput.value.trim();

    if (!name) {
        alert('请输入名字！');
        return;
    }

    if (participants.includes(name)) {
        alert('这个名字已经存在！');
        return;
    }

    participants.push(name);
    participantNameInput.value = '';
    renderParticipants();

    // If this is the first participant, set as current user
    if (participants.length === 1) {
        currentUser = name;
        assignedNameEl.textContent = '点击开始匹配';
    }

    // Show match section when we have at least 2 participants
    if (participants.length >= 2) {
        matchSection.style.display = 'block';
    }
}

function renderParticipants() {
    participantsGrid.innerHTML = '';

    participants.forEach((name, index) => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.innerHTML = `
            <div class="participant-name">${name}</div>
            <div class="participant-remove" data-index="${index}">移除</div>
        `;

        card.querySelector('.participant-remove').addEventListener('click', (e) => {
            removeParticipant(index);
        });

        participantsGrid.appendChild(card);
    });
}

function removeParticipant(index) {
    participants.splice(index, 1);
    renderParticipants();

    if (participants.length < 2) {
        matchSection.style.display = 'none';
    }
}

startMatchBtn.addEventListener('click', () => {
    if (participants.length < 2) {
        alert('至少需要2个参与者！');
        return;
    }

    if (participants.length === 1) {
        assignedNameEl.textContent = '需要至少2个朋友才能开始匹配！';
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

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedGroupInfo = localStorage.getItem('groupInfo');
    if (savedGroupInfo) {
        const { name, budget, date } = JSON.parse(savedGroupInfo);
        groupNameInput.value = name;
        budgetSelect.value = budget;
        eventDateInput.value = date;
    }

    // Add current user as first participant
    const defaultName = '我';
    if (!participants.includes(defaultName)) {
        addParticipant.call({ value: defaultName });
        participantNameInput.value = '';
    }
});

// Add smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add suggestion card interactions
document.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// Add floating animation to decorative gifts
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
});

document.querySelectorAll('.gift-box').forEach(gift => {
    observer.observe(gift);
});
