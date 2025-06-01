// Game state
let gameState = {
    currentScene: 'INTRO',
    inventory: [],
    playerName: '',
    visitedScenes: [],
    gameEnded: false,
    textShown: false
};

// Game scenes and logic
const scenes = {
    INTRO: {
        text: "Welcome to the Pirate Goose Adventure! You are a brave goose who has found yourself aboard a pirate ship in the middle of the vast ocean.",
        inputPrompt: "What is your goose name, brave feathered one?",
        onInput: (input) => {
            gameState.playerName = input;
            goToScene('OPENING_SCENE');
        }
    },
    
    OPENING_SCENE: {
        text: () => `Ahoy, Captain ${gameState.playerName}! You find yourself on the deck of 'The Salty Feather', a weathered pirate ship. The ocean stretches endlessly in all directions. Salty spray hits your beak. The crew of scurvy pirates eyes you suspiciously... What do you do?`,
        choices: [
            { text: "🦢 Honk loudly and flap your wings to show dominance", action: () => goToScene('PIRATE_CONFRONTATION') },
            { text: "✨ Try to steal something shiny from his pocket", action: () => { addItem('coin'); showText("'Oi! That bird's a thief!' the pirate shouts."); goToScene('PIRATE_CONFRONTATION'); } },
            { text: "🗺️ Explore the ship to find treasure", action: () => goToScene('EXPLORE_SHIP') },
            { text: "👁️ Fly up to the crow's nest to scout for land", action: () => goToScene('CROWS_NEST') },
            { text: "🍽️ Search for food in the ship's kitchen", action: () => goToScene('KITCHEN_SCENE') }
        ]
    },
    
    PIRATE_CONFRONTATION: {
        text: "The bearded pirate draws his cutlass! 'Let's see what this bird can do!' The other pirates form a circle, cheering for a fight.",
        choices: [
            { text: "⚔️ Use your wings to knock the sword away", action: () => { addItem('cutlass'); showText("You brilliantly disarm the pirate!"); goToScene('OPENING_SCENE'); } },
            { text: "🧩 Challenge him to a riddle contest instead", action: () => goToScene('PIRATE_RIDDLE_DUEL') }
        ]
    },
    
    PIRATE_RIDDLE_DUEL: {
        text: "'A riddle contest? Har! I accept, clever bird!' The pirate grins. 'What can fly, swim, and walk, but can't bite?'",
        choices: [
            { text: "🦢 A goose!", action: () => { addItem('coin'); showText("'Damn, I guess you win!' The pirate tosses you a coin."); goToScene('OPENING_SCENE'); } },
            { text: "🐦 A duck!", action: () => { showText("'WRONG!' The pirate's blade finds its mark. You die painfully."); endGame("You chose poorly and met a painful end. The ocean claims another brave goose..."); } },
            { text: "🐧 A penguin!", action: () => { showText("'WRONG!' The pirate's blade finds its mark. You die painfully."); endGame("You chose poorly and met a painful end. The ocean claims another brave goose..."); } },
            { text: "🦆 A swan!", action: () => { showText("'WRONG!' The pirate's blade finds its mark. You die painfully."); endGame("You chose poorly and met a painful end. The ocean claims another brave goose..."); } }
        ]
    },
    
    EXPLORE_SHIP: {
        text: "You waddle around the ship, investigating every nook and cranny. Where would you like to explore?",
        choices: [
            { text: "🚪 Enter the captain's quarters", action: () => goToScene('CAPTAINS_QUARTERS') },
            { text: "⚔️ Check out the weapon storage", action: () => goToScene('WEAPON_STORAGE') },
            { text: "🔒 Examine the mysterious locked door", action: () => goToScene('PUZZLE_DOOR') },
            { text: "🔙 Return to the deck", action: () => goToScene('OPENING_SCENE') }
        ]
    },
    
    CAPTAINS_QUARTERS: {
        text: "You sneak into the captain's quarters. Papers are scattered across an ornate desk. You find a document that mentions a hidden treasure on a nearby island!",
        onEnter: () => addItem('treasure_map'),
        choices: [
            { text: "🔙 Return to exploring the ship", action: () => goToScene('EXPLORE_SHIP') }
        ]
    },
    
    WEAPON_STORAGE: {
        text: () => {
            if (!hasItem('cutlass')) {
                addItem('cutlass');
                return "You discover the ship's armory! Among the weapons, you find a fine cutlass that catches your eye.";
            }
            return "The weapon storage is mostly empty now, just some rusty old swords remain.";
        },
        choices: [
            { text: "🔙 Return to exploring the ship", action: () => goToScene('EXPLORE_SHIP') }
        ]
    },
    
    KITCHEN_SCENE: {
        text: "You waddle into the ship's kitchen and see a strange cooking recipe. You ask the cook what it means. The cook honks, but they have too strong of a Russian duck accent to understand. You decide to take the recipe.",
        onEnter: () => addItem('ancient_cooking_recipe'),
        choices: [
            { text: "🔙 Return to the ship", action: () => goToScene('OPENING_SCENE') }
        ]
    },
    
    CROWS_NEST: {
        text: "You spread your wings and fly up to the crow's nest. From this height, you can see for miles! In the distance, you spot a mysterious island shrouded in mist!",
        choices: [
            { text: "🏝️ Signal the crew to head toward the island", action: () => goToScene('ISLAND_LANDING') },
            { text: "🔙 Fly back down to the deck", action: () => goToScene('OPENING_SCENE') }
        ]
    },
    
    PUZZLE_DOOR: {
        text: "You discover a heavy wooden door covered in strange symbols and mechanisms. A brass plaque reads: 'Only the clever may pass beyond this portal.' The door has three spinning dials with different symbols on each.",
        choices: [
            { text: "🔍 Examine the symbols more closely", action: () => goToScene('SYMBOL_RIDDLE_PUZZLE') },
            { text: "🎲 Try random combinations", action: () => { showText("You peck randomly, but the door glows red! 'WRONG!' echoes."); goToScene('SYMBOL_RIDDLE_PUZZLE'); } },
            { text: "🔙 Look elsewhere for treasure", action: () => goToScene('EXPLORE_SHIP') }
        ]
    },
    
    SYMBOL_RIDDLE_PUZZLE: {
        text: "You notice symbols: anchors, skulls, ships, stars, and compass roses. The three riddles carved above the dials read: 'First: I guide sailors home but am not the sun, I point the way when day is done.' 'Second: I sail the seas but have no wind, I carry treasure and pirates grinned.' 'Third: Though I may warn of danger near, pirates wear me without fear.'",
        choices: [
            { text: "🧭⛵💀 Set dials to: Compass Rose, Ship, Skull", action: () => { addItem('ancient_key'); showText("Click! The dials align perfectly and the door creaks open!"); goToScene('SECRET_CHAMBER'); } },
            { text: "⭐⚓🧭 Set dials to: Star, Anchor, Compass Rose", action: () => { showText("The door flashes red and makes an angry buzzing sound."); goToScene('SYMBOL_RIDDLE_PUZZLE'); } },
            { text: "⚓💀⛵ Set dials to: Anchor, Skull, Ship", action: () => { showText("Close, but not quite right! The door remains locked."); goToScene('SYMBOL_RIDDLE_PUZZLE'); } }
        ]
    },
    
    SECRET_CHAMBER: {
        text: "Beyond the puzzle door lies a hidden chamber filled with ancient artifacts! Dusty books, strange maps, and mysterious devices line the walls. In the center sits an ornate chest with yet another puzzle lock.",
        choices: [
            { text: "📦 Examine the puzzle chest", action: () => goToScene('CHEST_PUZZLE') },
            { text: "🗺️ Study the ancient maps", action: () => { addItem('treasure_map'); showText("You discover that there is an island nearby with great treasure!"); goToScene('SECRET_CHAMBER'); } }
        ]
    },
    
    CHEST_PUZZLE: {
        text: "The chest has four numbered dials and a mathematical riddle: 'A pirate crew of 20 split treasure equally among themselves. But 3 were lost in battle, and 2 joined later. 4 stayed to guard the ship. The remaining crew split 95 gold coins with 5 left over. How many coins did each pirate receive?'",
        choices: [
            { text: "5️⃣ Enter 5", action: () => { showText("The chest makes a disappointed clicking sound. Think again!"); goToScene('CHEST_PUZZLE'); } },
            { text: "6️⃣ Enter 6", action: () => { addItem('coin'); showText("*CLICK* The chest opens! Inside you find... a coin!! The math: 20-3+2-4=15 pirates split 90 coins (95-5) = 6 each!"); goToScene('OPENING_SCENE'); } },
            { text: "4️⃣ Enter 4", action: () => { showText("Not quite right. Remember the 5 coins left over!"); goToScene('CHEST_PUZZLE'); } },
            { text: "7️⃣ Enter 7", action: () => { showText("Too high! Check your arithmetic, clever goose."); goToScene('CHEST_PUZZLE'); } }
        ]
    },
    
    ISLAND_LANDING: {
        text: "The ship changes course toward the mysterious island! As you get closer, you see ancient stone statues and overgrown temples. The captain calls for volunteers to explore the island...",
        choices: [
            { text: "🏝️ Volunteer to lead the expedition", action: () => goToScene('ISLAND_DISCOVERIES') }
        ]
    },
    
    ISLAND_DISCOVERIES: {
        text: "You lead a small crew to the mysterious island. Ancient ruins covered in vines stretch before you. Strange symbols are carved into stone pillars around a central temple.",
        choices: [
            { text: "🗿 Examine the symbol pillars", action: () => goToScene('TEMPLE_SYMBOL_PUZZLE') },
            { text: "🏛️ Enter the temple directly", action: () => goToScene('TEMPLE_ENTRANCE') },
            { text: "🌿 Search the jungle for clues first", action: () => { showText("You explore the jungle and find a secret passage!"); goToScene('SECRET_TEMPLE_PASSAGES'); } }
        ]
    },
    
    TEMPLE_SYMBOL_PUZZLE: {
        text: "Four stone pillars surround the temple, each with different ancient symbols. A stone tablet reads: 'Arrange the seasons of the sea: When storms rage, when calm prevails, when life blooms, when death sails.'",
        choices: [
            { text: "⛈️🌊🌺💀 Touch pillars: Storm, Calm, Life, Death", action: () => { addItem('temple_key'); showText("The pillars glow with ancient power! The temple doors slowly open."); goToScene('TEMPLE_INNER_SANCTUM'); } },
            { text: "🌺⛈️🌊💀 Touch pillars: Life, Storm, Calm, Death", action: () => { showText("Nothing happens. The riddle speaks of sea seasons..."); goToScene('TEMPLE_SYMBOL_PUZZLE'); } },
            { text: "🌊⛈️💀🌺 Touch pillars: Calm, Storm, Death, Life", action: () => { showText("The pillars vibrate ominously. Wrong sequence!"); goToScene('TEMPLE_SYMBOL_PUZZLE'); } },
            { text: "🔍 Study the symbols more carefully first", action: () => { showText("Storm clouds, calm waves, blooming coral, skeletal fish..."); goToScene('TEMPLE_SYMBOL_PUZZLE'); } }
        ]
    },
    
    TEMPLE_ENTRANCE: {
        text: "You go into a large room in the shape of a dome. Your crew looks around and honk at the many strange pillars. There appears to be a pedestal to hold a weapon in the center of the room. What do you do?",
        choices: [
            { 
                text: "⚔️ Place a cutlass on the pedestal", 
                condition: () => hasItem('cutlass'),
                action: () => { 
                    removeItem('cutlass'); 
                    addItem('gem'); 
                    showText("You place the cutlass on the pedestal. It slides into the ground, taking the cutlass with it! Thankfully, it comes back up with a gem!"); 
                    goToScene('TEMPLE_ENTRANCE_OPTIONS'); 
                } 
            },
            { text: "🦢 Put a crewmember on the pedestal", action: () => { showText("You grab a crewmember and throw them onto the pedestal! The goose looks around, but nothing happens."); goToScene('TEMPLE_ENTRANCE'); } },
            { text: "😤 Put yourself on the pedestal", action: () => { addItem('coin'); showText("You are apparently a registered weapon of mass destruction! You slide off right as the pedestal goes down, and a coin appears!"); goToScene('TEMPLE_ENTRANCE_OPTIONS'); } }
        ]
    },
    
    TEMPLE_ENTRANCE_OPTIONS: {
        text: "You look around the temple dome. There are several passages you can explore.",
        choices: [
            { text: "🌑 Go down the dark corridor", action: () => goToScene('SECRET_TEMPLE_PASSAGES') },
            { text: "🏛️ Go deeper into the temple", action: () => goToScene('TEMPLE_INNER_SANCTUM') },
            { text: "⬇️ Go to the basement", action: () => goToScene('BASEMENT') }
        ]
    },
    
    SECRET_TEMPLE_PASSAGES: {
        text: "You enter a vast dark hallway with the rest of your crew. What do you do?",
        choices: [
            { text: "👥 Tell a crew member to go first", action: () => { showText("A scared member of your crew walks slowly into the corridor... and suddenly jumps back as the entire corridor lights up!"); goToScene('LIT_UP_HALLWAY'); } },
            { text: "💪 Go into the passages bravely yourself", action: () => { showText("You bravely walk in... and suddenly the entire corridor lights up!"); goToScene('LIT_UP_HALLWAY'); } },
            { text: "🪨 Throw a rock into the corridor", action: () => goToScene('ROCK_THROWING') }
        ]
    },
    
    ROCK_THROWING: {
        text: "You throw a rock in, but nothing happens.",
        choices: [
            { text: "↩️ Try previous options", action: () => goToScene('SECRET_TEMPLE_PASSAGES') },
            { text: "🪙 Throw a coin in", action: () => goToScene('COIN_THROWING') }
        ]
    },
    
    COIN_THROWING: {
        text: "You grab a coin from a crewmember and toss it into the hallway. The crewmember honks angrily at you, and the rest of the crew stares at you angrily as nothing happens.",
        choices: [
            { text: "↩️ Try previous options", action: () => goToScene('ROCK_THROWING') },
            { 
                text: "🪙 Throw another coin in", 
                condition: () => hasItem('coin'),
                action: () => { 
                    if (hasItem('coin')) removeItem('coin');
                    showText("You take one of your own coins. You throw it, and suddenly the hallway lights up!"); 
                    goToScene('LIT_UP_HALLWAY'); 
                } 
            }
        ]
    },
    
    LIT_UP_HALLWAY: {
        text: "You enter the hallway, and you see that there is a great box. In the box is... a pot? It appears you have to cook.",
        choices: [
            { 
                text: "📜 Use the ancient recipe", 
                condition: () => hasItem('ancient_cooking_recipe'),
                action: () => { 
                    addItem('gem'); 
                    showText("You take out the ancient recipe and begin to cook! You produce a legendary cake, filled with worms, insects and plenty of grass. The box's secret compartment opens, revealing a gem!"); 
                    goToScene('TEMPLE_ENTRANCE'); 
                } 
            },
            { text: "👵 Cook your own recipe", action: () => { addItem('coin'); showText("You take out your mother's old recipe and produce an insect muffin! A brick slides out and you find a coin inside!"); goToScene('COOKING_EXIT_OPTIONS'); } }
        ]
    },
    
    COOKING_EXIT_OPTIONS: {
        text: "You turn to talk with your crew, but as you turn you spot another room and some stairs to the left. What do you do?",
        choices: [
            { text: "🚪 Enter the room", action: () => goToScene('TEMPLE_ENTRANCE') },
            { text: "⬇️ Go down stairs", action: () => goToScene('BASEMENT') }
        ]
    },
    
    TEMPLE_INNER_SANCTUM: {
        text: "Inside the temple, golden light illuminates ancient murals depicting goose-pirates of legend. Your crew looks in awe at the center pedestal, where there lies a crystalline puzzle box.",
        choices: [
            { text: "💎 Solve the crystal puzzle box", action: () => goToScene('CRYSTAL_LOGIC_PUZZLE') },
            { text: "🎨 Study the legendary goose-pirate murals", action: () => { addItem('ancient_wisdom'); showText("You learn the secret history of your kind!"); goToScene('GOOSE_PIRATE_LEGACY'); } },
            { text: "🔍 Search for hidden passages", action: () => goToScene('SECRET_TEMPLE_PASSAGES') }
        ]
    },
    
    GOOSE_PIRATE_LEGACY: {
        text: "Apparently, your kind was once a great civilization! They had once been technologically superior to all beings in the land, but then a strange group called the ducks attacked! Those vile ducks!",
        choices: [
            { text: "🔙 Return to the inner sanctum", action: () => goToScene('TEMPLE_INNER_SANCTUM') }
        ]
    },
    
    CRYSTAL_LOGIC_PUZZLE: {
        text: "The crystalline box has colored gems that light up in patterns. A voice echoes: 'The greatest treasure is in the coin'",
        choices: [
            { 
                text: "🪙 Place all coins in the box", 
                condition: () => countCoins() >= 3,
                action: () => { 
                    addItem('heart_of_ocean'); 
                    showText("Perfect! The crystal box opens revealing the Heart of the Ocean!"); 
                    goToScene('LEGENDARY_TREASURE_ENDING'); 
                } 
            },
            { 
                text: "🪙 Place current coins in", 
                condition: () => countCoins() < 3,
                action: () => { 
                    showText(`You are too poor :( You need ${3 - countCoins()} more coins!`); 
                    action: () => goToScene('TOO_POOR_ENDING'); 
                } 
            },
            { 
                text: "💎 Place all gems in", 
                condition: () => countGems() >= 3,
                action: () => goToScene('FRIENDS_ALONG_THE_WAY_ENDING') 
            }
        ]
    },
    
    BASEMENT: {
        text: "The basement is dark and musty. Your crew waddles around dust covered books and cobwebs. Eventually, you see a very large book.",
        choices: [
            { text: "📚 Examine the large book", action: () => goToScene('BOOK_WORD_PUZZLE') }
        ]
    },
    
    BOOK_WORD_PUZZLE: {
        text: "The locked book has letter tiles that can be rearranged. The clue reads: 'Rearrange these letters to name what every pirate seeks: RETRAUSE' You also see a location that looks like it could hold a large piece of paper.",
        inputPrompt: "Rearrange the letters to spell a word:",
        choices: [
            { 
                text: "🗺️ Place treasure map here", 
                condition: () => hasItem('treasure_map'),
                action: () => { 
                    addItem('gem'); 
                    showText("You hear a whirring noise, and the ceiling suddenly opens! When the dust settles, you find a gem!"); 
                    goToScene('BASEMENT_EXIT_OPTIONS'); 
                } 
            }
        ],
        onInput: (input) => {
            if (input.toLowerCase() === 'treasure') {
                addItem('coin');
                showText("The lock clicks open! You find a coin!");
                goToScene('BASEMENT_EXIT_OPTIONS');
            } else {
                showText("Not quite right. Think about what pirates value most!");
                goToScene('BOOK_WORD_PUZZLE');
            }
        }
    },
    
    BASEMENT_EXIT_OPTIONS: {
        text: "You and your group decide to leave. 3 of the crew honk at 3 different staircases at the same time. They all look at each other angrily and start bickering. Loud honks fill the room, and you had better choose where to go fast!",
        choices: [
            { text: "🏛️ Go to Temple Inner Sanctum", action: () => goToScene('TEMPLE_INNER_SANCTUM') },
            { text: "🚪 Go to Temple Entrance", action: () => goToScene('TEMPLE_ENTRANCE') },
            { text: "🌑 Go to Secret Temple Passages", action: () => goToScene('SECRET_TEMPLE_PASSAGES') }
        ]
    },
    
    LEGENDARY_TREASURE_ENDING: {
        text: "With the Heart of the Ocean in your possession, you have become the most legendary pirate goose in history! The crystal pulses with ancient power, granting you command over the seas themselves. Ships now flee at the sight of your feathers, and your name is whispered in awe across every port!",
        isEnding: true
    },

    TOO_POOR_ENDING: {
        text: "You were too poor to open the box. Maybe in another life!",
        isEnding: true
    },
    
    FRIENDS_ALONG_THE_WAY_ENDING: {
        text: () => {
            if (hasItem('ancient_wisdom')) {
                return "You start hearing strange noises. With your ancient knowledge, you know that this is the greatest treasure of them all! A secret compartment of the box slides, and out comes... Nothing. Turns out the greatest treasure was the friends you made along the way!";
            } else {
                return "You start hearing strange noises. You have no clue what is happening, but you can see that a secret compartment seems to be coming out. As the dust settles, you see... The greatest gem of your life! It is massive, in the shape of a goose! You have finally found the greatest treasure of all!";
            }
        },
        isEnding: true
    }
};

// Utility functions
function hasItem(item) {
    return gameState.inventory.includes(item);
}

function addItem(item) {
    if (!hasItem(item)) {
        gameState.inventory.push(item);
        updateInventoryDisplay();
    }
}

function removeItem(item) {
    const index = gameState.inventory.indexOf(item);
    if (index > -1) {
        gameState.inventory.splice(index, 1);
        updateInventoryDisplay();
    }
}

function countCoins() {
    return gameState.inventory.filter(item => item.includes('coin')).length;
}

function countGems() {
    return gameState.inventory.filter(item => item === 'gem').length;
}

function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory-items');
    if (gameState.inventory.length === 0) {
        inventoryDiv.innerHTML = 'Empty';
    } else {
        inventoryDiv.innerHTML = gameState.inventory.map(item => {
            const displayNames = {
                'coin': '🪙 Coin',
                'cutlass': '⚔️ Cutlass',
                'treasure_map': '🗺️ Treasure Map',
                'ancient_cooking_recipe': '📜 Ancient Recipe',
                'ancient_key': '🔑 Ancient Key',
                'temple_key': '🔑 Temple Key',
                'gem': '💎 Gem',
                'ancient_wisdom': '📚 Ancient Wisdom',
                'heart_of_ocean': '💙 Heart of the Ocean'
            };
            return `<span class="inventory-item">${displayNames[item] || item}</span>`;
        }).join('');
    }
}

function showText(text) {
    const storyDiv = document.getElementById('story-content');
    storyDiv.innerHTML += `<div style="margin: 10px 0; padding: 10px; background: rgba(255, 215, 0, 0.2); border-radius: 5px; border-left: 3px solid #ffd700;">${text}</div>`;

    gameState.textShown = true;
}

function goToScene(sceneName) {
    function logic() {
        gameState.currentScene = sceneName;
        gameState.visitedScenes.push(sceneName);
        renderScene();
    }

    if(gameState.textShown) {
        document.getElementById('choices').innerHTML = '';
        setTimeout(() => {
            logic()
            gameState.textShown = false;
        }, 3000)
    } else {
        logic()
    }

}

function endGame(message) {
    gameState.gameEnded = true;
    const storyDiv = document.getElementById('story-content');
    storyDiv.innerHTML += `<div class="ending">${message}</div>`;
    document.getElementById('choices').innerHTML = '';
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';
}

function renderScene() {
    const scene = scenes[gameState.currentScene];
    if (!scene) return;

    const storyDiv = document.getElementById('story-content');
    const choicesDiv = document.getElementById('choices');
    const inputSection = document.getElementById('input-section');

    // Clear previous content
    choicesDiv.innerHTML = '';
    inputSection.style.display = 'none';

    // Execute onEnter function if it exists
    if (scene.onEnter) {
        scene.onEnter();
    }

    // Display story text
    let storyText = typeof scene.text === 'function' ? scene.text() : scene.text;
    storyDiv.innerHTML = `<div>${storyText}</div>`;

    // Check if this is an ending
    if (scene.isEnding) {
        endGame(storyText);
        return;
    }

    // Handle input prompt
    if (scene.inputPrompt) {
        inputSection.style.display = 'block';
        document.getElementById('text-input').placeholder = scene.inputPrompt;
        document.getElementById('text-input').value = '';
        document.getElementById('text-input').focus();
        
        const submitHandler = () => {
            const input = document.getElementById('text-input').value.trim();
            if (input && scene.onInput) {
                scene.onInput(input);
            }
        };
        
        document.getElementById('submit-btn').onclick = submitHandler;
        document.getElementById('text-input').onkeypress = (e) => {
            if (e.key === 'Enter') submitHandler();
        };
    }

    // Handle choices
    if (scene.choices) {
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            
            // Check if choice has a condition
            if (choice.condition && !choice.condition()) {
                button.disabled = true;
                button.textContent += ' (Not available)';
            } else {
                button.onclick = choice.action;
            }
            
            choicesDiv.appendChild(button);
        });
    }
}

function restartGame() {
    gameState = {
        currentScene: 'INTRO',
        inventory: [],
        playerName: '',
        visitedScenes: [],
        gameEnded: false
    };
    
    document.getElementById('story-content').innerHTML = '';
    document.getElementById('restart-btn').style.display = 'none';
    updateInventoryDisplay();
    renderScene();
}
// Utility functions
        function hasItem(item) {
            return gameState.inventory.includes(item);
        }

        function addItem(item) {
            // Allow multiple coins and gems, but prevent duplicates of other items
            const allowMultiple = ['coin', 'gem'];
            if (allowMultiple.includes(item) || !hasItem(item)) {
                gameState.inventory.push(item);
                updateInventoryDisplay();
            }
        }

        function removeItem(item) {
            const index = gameState.inventory.indexOf(item);
            if (index > -1) {
                gameState.inventory.splice(index, 1);
                updateInventoryDisplay();
            }
        }

        function countCoins() {
            return gameState.inventory.filter(item => item.includes('coin')).length;
        }

        function countGems() {
            return gameState.inventory.filter(item => item === 'gem').length;
        }

        function updateInventoryDisplay() {
            const inventoryDiv = document.getElementById('inventory-items');
            if (gameState.inventory.length === 0) {
                inventoryDiv.innerHTML = 'Empty';
            } else {
                // Count items for display
                const itemCounts = {};
                gameState.inventory.forEach(item => {
                    itemCounts[item] = (itemCounts[item] || 0) + 1;
                });
                
                inventoryDiv.innerHTML = Object.entries(itemCounts).map(([item, count]) => {
                    const displayNames = {
                        'coin': '🪙 Coin',
                        'cutlass': '⚔️ Cutlass',
                        'treasure_map': '🗺️ Treasure Map',
                        'ancient_cooking_recipe': '📜 Ancient Recipe',
                        'ancient_key': '🔑 Ancient Key',
                        'temple_key': '🔑 Temple Key',
                        'gem': '💎 Gem',
                        'ancient_wisdom': '📚 Ancient Wisdom',
                        'heart_of_ocean': '💙 Heart of the Ocean'
                    };
                    const displayName = displayNames[item] || item;
                    return `<span class="inventory-item">${displayName}${count > 1 ? ` (${count})` : ''}</span>`;
                }).join('');
            }
        }

// Initialize game
updateInventoryDisplay();
renderScene();