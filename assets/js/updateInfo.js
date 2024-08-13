async function loadRaidData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/ChangJoEconomy/LostarkHomeworkData/main/data.json?timestamp=${new Date().getTime()}`;
        if (!response.ok) {
            console.error('Failed to load raid data:', response.statusText);
            return;
        }
        const data = await response.json();
        updateRaidDetails(data);
    } catch (error) {
        console.error('Error loading raid data:', error);
    }
}

function updateRaidDetails(data) {
    const raidRequirements = {
        "에기르": { hard: 1680, normal: 1660 },
        "베히모스": { hard: null, normal: 1640 },
        "에키드나": { hard: 1630, normal: 1620 },
        "카멘": { hard: 1630, normal: 1610 },
        "상아탑": { hard: 1620, normal: 1600 },
        "일리아칸": { hard: 1600, normal: 1580 },
        "카양겔": { hard: 1580, normal: 1540 },
        "아브렐슈드": { hard: 1550, normal: 1540 },
        "쿠크세이튼": { hard: null, normal: 1475 }
    };

    const raids = Object.keys(raidRequirements);

    raids.forEach((raidName) => {
        const raidElements = document.querySelectorAll(`.raid .details h3`);
        raidElements.forEach(raidElement => {
            if (raidElement.innerText === raidName) {
                const detailsElement = raidElement.parentElement;

                let hardParticipants = {};
                let normalParticipants = {};

                const hardRequirement = raidRequirements[raidName].hard;
                const normalRequirement = raidRequirements[raidName].normal;

                for (const user in data) {
                    data[user].slice(1).forEach(character => {
                        const characterName = character[0];
                        const characterJob = character[1];
                        const characterLevel = character[2];
                        const raidAvailable = character[raids.indexOf(raidName) + 3]; // raidName에 해당하는 index

                        if (!raidAvailable) { // true로 표시된 항목은 제외
                            const canAttendHard = hardRequirement && characterLevel >= hardRequirement;
                            const canAttendNormal = normalRequirement && characterLevel >= normalRequirement;

                            const characterDisplay = `
                                <img src="images/jobs/${characterJob}.png" alt="${characterJob}" title="${characterName}" style="width: 40px; height: 40px; vertical-align: middle;">
                            `;

                            if (canAttendHard) {
                                if (!hardParticipants[user]) {
                                    hardParticipants[user] = [];
                                }
                                hardParticipants[user].push(characterDisplay);
                            } else if (canAttendNormal) {
                                if (!normalParticipants[user]) {
                                    normalParticipants[user] = [];
                                }
                                normalParticipants[user].push(characterDisplay);
                            }
                        }
                    });
                }

                // 하드와 노말 정보 및 캐릭터 목록 업데이트
                const hardCount = Object.keys(hardParticipants).length;
                const normalCount = Object.keys(normalParticipants).length;

                const hardCharacterList = Object.entries(hardParticipants).map(([user, chars]) => {
                    return `${user} - ${chars.join(' ')}`;
                }).join('<br>');

                const normalCharacterList = Object.entries(normalParticipants).map(([user, chars]) => {
                    return `${user} - ${chars.join(' ')}`;
                }).join('<br>');

                // 하드 난이도가 없는 레이드의 경우 하드 정보를 표시하지 않음
                detailsElement.innerHTML = `
                    <h3>${raidName}</h3>
                    ${hardRequirement !== null && hardCount > 0 ? `<p><strong class="hard">하드 ${hardCount}</strong></p><p>${hardCharacterList}</p>` : ''}
                    ${normalCount > 0 ? `<p><strong class="normal">노말 ${normalCount}</strong></p><p>${normalCharacterList}</p>` : ''}
                `;
            }
        });
    });
}


