export default class RandomUtils {

    static chance = new Chance();

    static seed = new Date().getTime()

    static setSeed(seed = new Date().getTime()) {

        RandomUtils.seed = seed;

        RandomUtils.chance = new Chance(RandomUtils.seed);
    }

    /**
     * @param {*} min the minimum number (inclusive)
     * @param {*} max the maximum number (inclusive)
     * @returns a random integer.
     */
    static nextInt(min, max) {
        return RandomUtils.chance.integer({ min: min, max: max })
    }

    static nextBool() {
        return RandomUtils.chance.bool();
    }

    static nextCells(matrix, numberOfCells = 1) {

        // Get the number of rows and columns in the matrix
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        const pickedCells = new Set();

        // Pick the random cells
        while (pickedCells.size < numberOfCells) {

            const row = RandomUtils.nextInt(0, numRows - 1);
            const col = RandomUtils.nextInt(0, numCols - 1);

            const cellString = `${row}_${col}`;

            pickedCells.add(cellString);
        }

        return [...pickedCells].map(e => e.split("_")).map(([i, j]) => ({ i: parseInt(i), j: parseInt(j) }));
    }
}
