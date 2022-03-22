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
			alert("Correct! " + tries + " tries");
			init();
		}, 2000);
	}
	
	function gameLoss() {
		setTimeout(() => {
			alert("Correct word was " + wotd);
			init();
		}, 2000);
	}

	function keydown(row, letter, e) {
		let guess = row.map((letter) => letter.val.toLowerCase()).join("");
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
				alert("Invalid word!");
			}
		} else if (isLetter(e.key)) {
			if (letter.n < 5 - 1) row[letter.n + 1].input.focus();
			if (!letter.val || letter.n < 5 - 1) letter.val = e.key;
		} else if (e.key == "Backspace") {
			letter.val = "";
			if (letter.n > 0) row[letter.n - 1].input.focus();
		}
		board[row.n] = board[row.n];
	}
</script>

<div class="content">
	<h1>Hello worldle!</h1>

	{#each board as row}
		{#each row as letter}
			<input
				class="slot"
				type="text"
				disabled={row.n != currentRow}
				bind:value={letter.val}
				bind:this={letter.input}
				on:keydown|preventDefault={(e) => keydown(row, letter, e)}
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
		padding: 100px;
		text-align: center;
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
