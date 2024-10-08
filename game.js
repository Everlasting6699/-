// 定义所有关卡的歌词
const lyricsLevel1 = {
    '你是我的眼': ['你', '是', '我的', '眼'],
    '我应该在车底': ['我', '应该', '在', '车底'],
    '九妹九妹漂亮的妹妹': ['九妹', '九妹', '漂亮的', '妹妹']
};

const lyricsLevel2 = {
    '更怕你永远停留在这里': ['更', '怕', '你', '永远', '停留', '在', '这里'],
    '丑八怪千万别把灯打开': ['丑八怪', '千万', '别', '把', '灯', '打开'],
    '我爱你爱着你就像老鼠爱大米': ['我', '爱', '你', '爱着', '你', '就像', '老鼠', '爱', '大米'],
    '情深深雨蒙蒙多少楼台烟雨中': ['情深深', '雨蒙蒙', '多少', '楼台', '烟雨', '中'],
    '你永远不懂我的黑像白天不懂夜的黑': ['你', '永远', '不懂', '我的', '黑', '像', '白天', '不懂', '夜的', '黑']
};

const lyricsLevel3 = {
    '有没有那么一首歌': ['有没有', '那么', '一首', '歌'],
    '能不能再给我一首歌的时间': ['能不能', '再给', '我', '一首', '歌', '的', '时间'],
    '你到底爱不爱我？': ['你', '到底', '爱', '不爱', '我？'],
    '我看透了他的心还有别人逗留的背影': ['我', '看透了', '他的', '心', '还有', '别人', '逗留', '的', '背影'],
    '东京下雨淋湿巴黎收音机': ['东京', '下雨', '淋湿', '巴黎', '收音机'],
    '窗外的麻雀在电线杆上多嘴': ['窗外', '的', '麻雀', '在', '电线杆', '上', '多嘴'],
    '但偏偏风渐渐把距离吹的很远': ['但', '偏偏', '风', '渐渐', '把', '距离', '吹的', '很远'],
    '多少的日子里总是一个人面对着天空发呆': ['多少', '的', '日子里', '总是', '一个人', '面对着', '天空', '发呆']
};

// 定义所有关卡的歌词集
const allLyrics = [lyricsLevel1, lyricsLevel2, lyricsLevel3];

// 游戏速度设置
const speedSettings = {
    1: 1000,  // 第一关：每1秒一个单词
    2: 800,   // 第二关：每0.8秒一个单词
    3: 600    // 第三关：每0.6秒一个单词
};

let currentLyricSet = lyricsLevel1;  // 当前关卡的歌词集
let currentLevel = 1;  // 当前关卡
let maxLevel = 3;  // 总共3关
let currentLyric = [];  // 当前玩家点击的歌词
let currentLyricName = null;  // 当前点击的歌词名字
let completedLyrics = 0;  // 已完成的歌词数量
let currentTime = 60;  // 每关60秒
let timerInterval, fallingInterval;

// 开始倒计时函数
function startTimer() {
    currentTime = 60;
    document.getElementById('timer').textContent = `剩余时间：${currentTime} 秒`;
    timerInterval = setInterval(() => {
        currentTime -= 1;
        document.getElementById('timer').textContent = `剩余时间：${currentTime} 秒`;

        // 检查倒计时结束
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            clearInterval(fallingInterval);
            alert('时间结束！游戏失败');
            resetGame();  // 重置游戏并回到第一关
        }
    }, 1000);  // 每1秒更新一次
}

// 创建彩色单词元素
function createWordElement(word, lyricName) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.textContent = word;
    wordElement.style.left = `${Math.random() * 90}%`;  // 随机水平位置
    wordElement.style.top = '0';
    wordElement.style.backgroundColor = getRandomColor();  // 随机彩色背景

    gameArea.appendChild(wordElement);
    
    // 单词下落逻辑
    let interval = setInterval(() => {
        wordElement.style.top = `${parseInt(wordElement.style.top) + 1}px`;
        if (parseInt(wordElement.style.top) > window.innerHeight - 100) {
            gameArea.removeChild(wordElement);
            clearInterval(interval);
        }
    }, 50);  // 调整下落速度

    // 单词点击事件，按顺序记录点击
    wordElement.addEventListener('click', () => {
        if (!currentLyricName) {
            currentLyricName = lyricName;  // 设置当前歌词
        }

        // 检查点击的歌词是否按顺序
        if (currentLyricName === lyricName) {
            if (currentLyric.length === 0 || currentLyric.length < currentLyricSet[lyricName].length) {
                currentLyric.push(word);
                displayArea.textContent = currentLyric.join(' ');

                // 检查是否点击顺序正确
                if (currentLyric.join(' ') !== currentLyricSet[lyricName].slice(0, currentLyric.length).join(' ')) {
                    alert('点击顺序错误，重新开始');
                    resetLyric();
                }

                // 检查歌词是否完成
                if (currentLyric.length === currentLyricSet[lyricName].length) {
                    alert(`完成: ${currentLyric.join(' ')}`);
                    completedLyrics += 1;
                    currentLyric = [];
                    currentLyricName = null;
                    displayArea.textContent = '';

                    // 检查是否通关
                    checkNextLevel();
                }
            }
        } else {
            // 如果从新歌词第一个字开始，重置
            currentLyric = [word];
            currentLyricName = lyricName;
            displayArea.textContent = word;
        }

        // 点击后移除单词
        gameArea.removeChild(wordElement);
        clearInterval(interval);
    });
}

// 生成随机颜色
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 掉落单词函数
function dropRandomWords() {
    const lyricNames = Object.keys(currentLyricSet);
    let randomLyric = lyricNames[Math.floor(Math.random() * lyricNames.length)];
    let randomWord = currentLyricSet[randomLyric][Math.floor(Math.random() * currentLyricSet[randomLyric].length)];
    createWordElement(randomWord, randomLyric);
}

// 游戏关卡开始函数
function startGame(level) {
    currentLevel = level;
    currentLyricSet = allLyrics[level - 1];  // 设置关卡的歌词集
    startTimer();  // 开始倒计时
    fallingInterval = setInterval(dropRandomWords, speedSettings[level]);  // 按当前关卡速度掉落单词
}

// 检查下一关卡
function checkNextLevel() {
    if (completedLyrics === 3) {
        if (currentLevel < maxLevel) {
            alert(`关卡 ${currentLevel} 完成！准备进入下一关。`);
            clearInterval(fallingInterval);
            clearInterval(timerInterval);  // 停止当前倒计时
            startGame(currentLevel + 1);  // 开始下一关
        } else {
            alert('恭喜你通关了所有关卡！');
            resetGame();  // 重置游戏
        }
    }
}

// 重置歌词顺序
function resetLyric() {
    currentLyric = [];
    displayArea.textContent = '';
}

// 游戏重置函数
function resetGame() {
    completedLyrics = 0;
    currentLyric = [];
    currentLyricName = null;
    displayArea.textContent = '';
    gameArea.innerHTML = '';  // 清空所有单词
    clearInterval(fallingInterval);
    startGame(1);  // 从第一关重新开始
}

// 在页面中加入倒计时显示
document.body.insertAdjacentHTML('beforeend', '<div id="timer" style="position: absolute; top: 10px; right: 10px; font-size: 24px;">剩余时间：60 秒</div>');

// 游戏区域和显示区域的引用
const gameArea = document.getElementById('gameArea');
const displayArea = document.getElementById('displayArea');

// 启动游戏
startGame(1);  // 从第一关开始
