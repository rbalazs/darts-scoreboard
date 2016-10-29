define("CheckoutTable", function () {
        return function CheckoutTable() {
            this.table = {
                41: '9 + D16',
                42: '10 + D16',
                43: '3 + D20',
                44: '4 + D20',
                45: '13 + D16',
                46: '6 + D20',
                47: '7 + D20',
                48: '16 + D16',
                49: '17 + D16',
                50: '18 + D16',
                51: '19 + D16',
                52: '20 + D16',
                53: '13 + D20',
                54: '14 + D20',
                55: '15 + D20',
                56: '16 + D20',
                57: '17 + D20',
                58: '18 + D20',
                59: '19 + D20',
                60: '20 + D20',
                61: 'T15 + D8',
                62: 'T10 + D16',
                63: 'T13 + D12',
                64: 'T16 + D8',
                65: 'T19 + D4',
                66: 'T14 + D12',
                67: 'T17 + D8',
                68: 'T20 + D4',
                69: 'T19 + D6',
                70: 'T18 + D8',
                71: 'T13 + D16',
                72: 'T16 + D12',
                73: 'T19 + D8',
                74: 'T14 + D16',
                75: 'T17 + D12',
                76: 'T20 + D8',
                77: 'T19 + D10',
                78: 'T18 + D12',
                79: 'T19 + D11',
                80: 'T20 + D10',
                81: 'T19 + D12',
                82: 'Bull + D16',
                83: 'T17 + D16',
                84: 'T20 + D12',
                85: 'T15 + D20',
                86: 'T18 + D16',
                87: 'T17 + D18',
                88: 'T20 + D14',
                89: 'T19 + D16',
                90: 'T20 + D15',
                91: 'T17 + D20',
                92: 'T20 + D16',
                93: 'T19 + D18',
                94: 'T18 + D20',
                95: 'T19 + D19',
                96: 'T20 + D18',
                97: 'T19 + D20',
                98: 'T20 + D19',
                99: 'T19 + 10 + D16',
                100: 'T20 + D20',
                101: 'T20 + 9 + D16',
                102: 'T16 + 14 + D20',
                103: 'T19 + 6 + D20',
                104: 'T16 + 16 + D20',
                105: 'T20 + 13 + D16',
                106: 'T20 + 6 + D20',
                107: 'T19 + 10 + D20',
                108: 'T20 + 16 + D16',
                109: 'T20 + 17 + D16',
                110: 'T20 + 10 + D20',
                111: 'T19 + 14 + D20',
                112: 'T20 + 20 + D16',
                113: 'T19 + 16 + D20',
                114: 'T20 + 14 + D20',
                115: 'T20 + 15 + D20',
                116: 'T20 + 16 + D20',
                117: 'T20 + 17 + D20',
                118: 'T20 + 18 + D20',
                119: 'T19 + 12 + Bull',
                120: 'T20 + 20 + D20',
                121: 'T20 + 11 + Bull',
                122: 'T18 + 18 + Bull',
                123: 'T19 + 16 + Bull',
                124: 'T20 + 14 + Bull',
                125: '25 + T20 + D20',
                126: 'T19 + 19 + Bull',
                127: 'T20 + 17 + Bull',
                128: '18 + T20 + Bull',
                129: '19 + T20 + Bull',
                130: 'T20 + 20 + Bull',
                131: 'T20 + T13 + D16',
                132: '25 + T19 + Bull',
                133: 'T20 + T19 + D8',
                134: 'T20 + T14 + D16',
                135: '25 + T20 + Bull',
                136: 'T20 + T20 + D8',
                137: 'T20 + T19 + D10',
                138: 'T20 + T18 + D12',
                139: 'T19 + T14 + D20',
                140: 'T20 + T20 + D10',
                141: 'T20 + T19 + D12',
                142: 'T20 + T14 + D20',
                143: 'T20 + T17 + D16',
                144: 'T20 + T20 + D12',
                145: 'T20 + T15 + D20',
                146: 'T20 + T18 + D16',
                147: 'T20 + T17 + D18',
                148: 'T20 + T20 + D14',
                149: 'T20 + T19 + D16',
                150: 'T20 + T18 + D18',
                151: 'T20 + T17 + D20',
                152: 'T20 + T20 + D16',
                153: 'T20 + T19 + D18',
                154: 'T20 + T18 + D20',
                155: 'T20 + T19 + D19',
                156: 'T20 + T20 + D18',
                157: 'T20 + T19 + D20',
                158: 'T20 + T20 + D19',
                160: 'T20 + T20 + D20',
                161: 'T20 + T17 + Bull',
                164: 'T20 + T18 + Bull',
                167: 'T20 + T19 + Bull',
                170: 'T20 + T20 + Bull'
            };

            this.adviseThrow = function (score) {
                var containsScore = false;
                for (var property in this.table) {
                    if (this.table.hasOwnProperty(property)) {
                        if (score == property) {
                            containsScore = true;
                            return this.table[property];
                        }
                    }
                }
                if (!containsScore) {
                    return score;
                }
            };
        }
    }
);