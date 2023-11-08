import {
  BONUS_NUMBER_WEIGHT,
  LAST_DECIMAL_PLACE_TO_DISPLAY,
  MATCHING_WINNING_COUNTS_FOR_USING_BONUS_NUMBER,
  MIN_MATCHING_COUNTS_FOR_PRIZE,
  PERCENT_CONVERSION_NUMBER,
  WINNING_NUMBER_WEIGHT,
  WINNING_PRIZE_BY_COUNT,
} from '../Constants.js';

class LottoGameResultCalculator {
  getGameResult({ lottos, winningNumbers, bonusNumber, purchaseAmount }) {
    const matchingResults = this.getMatchingResults({
      lottos,
      winningNumbers,
      bonusNumber,
    });
    const totalPrize = this.getTotalPrize(matchingResults);
    const rateOfReturn = this.getRateOfReturn({ totalPrize, purchaseAmount });
    return { matchingResults, totalPrize, rateOfReturn };
  }

  getMatchingResult(
    matchingCountWithWinningNumbers,
    matchingCountWithBonusNumber
  ) {
    return matchingCountWithWinningNumbers ===
      MATCHING_WINNING_COUNTS_FOR_USING_BONUS_NUMBER
      ? matchingCountWithWinningNumbers * WINNING_NUMBER_WEIGHT +
          matchingCountWithBonusNumber * BONUS_NUMBER_WEIGHT
      : matchingCountWithWinningNumbers * WINNING_NUMBER_WEIGHT;
  }

  getMatchingResults({ lottos, winningNumbers, bonusNumber }) {
    const matchingResults = { 3: 0, 4: 0, 5: 0, 5.5: 0, 6: 0 };
    lottos.forEach((lotto) => {
      const { matchingCountWithWinningNumbers, matchingCountWithBonusNumber } =
        lotto.getMatchingCount({ winningNumbers, bonusNumber });
      const matchingResult = this.getMatchingResult(
        matchingCountWithWinningNumbers,
        matchingCountWithBonusNumber
      );
      if (matchingResult < MIN_MATCHING_COUNTS_FOR_PRIZE) return;
      matchingResults[matchingResult] += 1;
    });
    return { ...matchingResults };
  }

  getTotalPrize(matchingResults) {
    let totalPrize = 0;
    Object.keys(matchingResults).forEach((matchingResult) => {
      totalPrize +=
        matchingResults[matchingResult] *
        WINNING_PRIZE_BY_COUNT[matchingResult];
    });
    return totalPrize;
  }

  getRateOfReturn({ totalPrize, purchaseAmount }) {
    return ((totalPrize / purchaseAmount) * PERCENT_CONVERSION_NUMBER).toFixed(
      LAST_DECIMAL_PLACE_TO_DISPLAY
    );
  }
}

export default LottoGameResultCalculator;