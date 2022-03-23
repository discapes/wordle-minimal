<script>
	import { tick } from "svelte";
	import { getColors, validWord, isLetter, getWord } from "./functions.js";

	let indexedArray = (l, func) =>
		Array(l)
			.fill(0)
			.map((_, n) => Object.assign(func(), { n: n }));
	let Letter = () => ({ val: "", input: null, bg: "#121213" });
	let Row = () => indexedArray(5, Letter);

	let wotd, currentRow, board;
	function init() {
		wotd = getWord();
		board = indexedArray(6, Row);
		currentRow = 0;
		tick().then(() => board[0][0].input.focus());
	}
	init();

	function gameWin() {
		let tries = currentRow;
		currentRow = -1;
		document.activeElement.blur();
		setTimeout(() => {
			console.log("Correct! " + tries + " tries");
			init();
		}, 2000);
	}

	function gameLoss() {
		setTimeout(() => {
			console.log("Correct word was " + wotd);
			init();
		}, 2000);
	}

	// need to have these separate because android doesnt support keydown except for enter and backspace on empty input
	function oninput(row, letter, e) {
		if (isLetter(e.data?.slice(-1)) && (!letter.val || letter.n < 5 - 1)) {
			letter.val = e.data.slice(-1);
			if (letter.n < 5 - 1) row[letter.n + 1].input.focus();
		} else {
			letter.val = letter.val[0];
		}
		board[row.n][letter.n] = board[row.n][letter.n];
	}
	function onkeydown(row, letter, e) {
		let guess = row
			.map((letter) => (letter.val ? letter.val.toLowerCase() : ""))
			.join("");
		if (e.key === "Enter") {
			if (validWord(guess)) {
				letter.input.blur();
				if (row.n < 6 - 1)
					tick().then(() => board[row.n + 1][0].input.focus());
				else gameLoss();
				if (guess == wotd) gameWin();
				getColors(guess, wotd).forEach(
					(color, i) => (row[i].bg = color)
				);
				currentRow++;
			} else {
				console.log("Invalid word!");
			}
		} else if (isLetter(e.key)) {
			if (letter.n < 5 - 1) row[letter.n + 1].input.focus();
			if (!letter.val || letter.n < 5 - 1) letter.val = e.key;
			e.preventDefault();
		} else if (e.key == "Tab") {
			e.preventDefault();
			p;
		} else if (e.key == "Backspace") {
			if (letter.val) letter.val = "";
			else if (letter.n > 0) {
				row[letter.n - 1].input.focus();
				row[letter.n - 1].val = "";
			}
			e.preventDefault();
		}
		board[row.n] = board[row.n];
	}
</script>

<div>
	<h1>Hello worldle!</h1>

	{#each board as row}
		{#each row as letter}
			<input
				class="slot"
				type="text"
				disabled={row.n != currentRow}
				bind:value={letter.val}
				bind:this={letter.input}
				on:input|preventDefault={(e) => oninput(row, letter, e)}
				on:keydown={(e) => onkeydown(row, letter, e)}
				style="background:{letter.bg}"
			/>
		{/each}
		<br />
	{/each}
</div>

<style>
	:global(body) {
		background: #121213;
		color: white;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slot {
		width: 40px;
		height: 40px;
		margin: 7px 5px;
		text-align: center;
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		text-transform: uppercase;
		user-select: none;
		padding: 0px;
		border-radius: 0px;
		border: 2px solid #3a3a3c;
	}
</style>
