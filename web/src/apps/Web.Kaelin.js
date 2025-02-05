module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_i32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function i32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function i32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };
    var f64 = new Float64Array(1);
    var u32 = new Uint32Array(f64.buffer);

    function f64_get_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            return (u32[0] >>> i) & 1;
        } else {
            return (u32[1] >>> (i - 32)) & 1;
        }
    };

    function f64_set_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            u32[0] = u32[0] | (1 << i);
        } else {
            u32[1] = u32[1] | (1 << (i - 32));
        }
        return f64[0];
    };

    function word_to_f64(w) {
        var x = 0;
        for (var i = 0; i < 64; ++i) {
            x = w._ === 'Word.i' ? f64_set_bit(x, i) : x;
            w = w.pred;
        };
        return x;
    };

    function f64_to_word(x) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 64; ++i) {
            w = {
                _: f64_get_bit(x, 64 - i - 1) ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function f64_make(s, a, b) {
        return (s ? 1 : -1) * Number(a) / 10 ** Number(b);
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
    };
    const inst_unit = x => x(null);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
                case 'new':
                    var $9 = int_pos(self);
                    var $10 = int_neg(self);
                    var $11 = c0($9)($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $18 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $13 = self.slice(0, -1);
                    var $14 = c1($13);
                    return $14;
                case 'i':
                    var $15 = self.slice(0, -1);
                    var $16 = c2($15);
                    return $16;
                case 'e':
                    var $17 = c0;
                    return $17;
            };
        })();
        return $18;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $19 = u16_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $22 = u32_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('i32') {
                case 'i32':
                    var $25 = i32_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $28 = u64_to_word(self);
                    var $29 = c0($28);
                    return $29;
            };
        })();
        return $30;
    });
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $33 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $31 = f64_to_word(self);
                    var $32 = c0($31);
                    return $32;
            };
        })();
        return $33;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $38 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $34 = c2;
                return $34;
            } else {
                var $35 = self.charCodeAt(0);
                var $36 = self.slice(1);
                var $37 = c2($35)($36);
                return $37;
            };
        })();
        return $38;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $42 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $39 = buffer32_to_depth(self);
                    var $40 = buffer32_to_u32array(self);
                    var $41 = c0($39)($40);
                    return $41;
            };
        })();
        return $42;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $43 = u32array_to_buffer32(_array$2);
        return $43;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $44 = null;
        return $44;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $45 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $45;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $46 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $46;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $48 = Array$tip$(_x$3);
            var $47 = $48;
        } else {
            var $49 = (self - 1n);
            var _half$5 = Array$alloc$($49, _x$3);
            var $50 = Array$tie$(_half$5, _half$5);
            var $47 = $50;
        };
        return $47;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $51 = word_to_u32(_value$1);
        return $51;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $52 = null;
        return $52;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $53 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $53;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $55 = Word$e;
            var $54 = $55;
        } else {
            var $56 = (self - 1n);
            var $57 = Word$o$(Word$zero$($56));
            var $54 = $57;
        };
        return $54;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $58 = 1n + _pred$1;
        return $58;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $59 = self.pred;
                        var $60 = Word$bit_length$go$($59, Nat$succ$(_c$3), _n$4);
                        return $60;
                    case 'Word.i':
                        var $61 = self.pred;
                        var $62 = Word$bit_length$go$($61, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $62;
                    case 'Word.e':
                        var $63 = _n$4;
                        return $63;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $64 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $64;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $66 = u32_to_word(self);
                var $67 = Word$bit_length$($66);
                var $65 = $67;
                break;
        };
        return $65;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $68 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $68;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $72 = Word$i$(Word$shift_left1$aux$($70, Bool$false));
                    var $71 = $72;
                } else {
                    var $73 = Word$o$(Word$shift_left1$aux$($70, Bool$false));
                    var $71 = $73;
                };
                var $69 = $71;
                break;
            case 'Word.i':
                var $74 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $76 = Word$i$(Word$shift_left1$aux$($74, Bool$true));
                    var $75 = $76;
                } else {
                    var $77 = Word$o$(Word$shift_left1$aux$($74, Bool$true));
                    var $75 = $77;
                };
                var $69 = $75;
                break;
            case 'Word.e':
                var $78 = Word$e;
                var $69 = $78;
                break;
        };
        return $69;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $80 = self.pred;
                var $81 = Word$o$(Word$shift_left1$aux$($80, Bool$false));
                var $79 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = Word$o$(Word$shift_left1$aux$($82, Bool$true));
                var $79 = $83;
                break;
            case 'Word.e':
                var $84 = Word$e;
                var $79 = $84;
                break;
        };
        return $79;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $86 = self.pred;
                var $87 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $89 = self.pred;
                            var $90 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $92 = Word$i$(Word$adder$(_a$pred$10, $89, Bool$false));
                                    var $91 = $92;
                                } else {
                                    var $93 = Word$o$(Word$adder$(_a$pred$10, $89, Bool$false));
                                    var $91 = $93;
                                };
                                return $91;
                            });
                            var $88 = $90;
                            break;
                        case 'Word.i':
                            var $94 = self.pred;
                            var $95 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $97 = Word$o$(Word$adder$(_a$pred$10, $94, Bool$true));
                                    var $96 = $97;
                                } else {
                                    var $98 = Word$i$(Word$adder$(_a$pred$10, $94, Bool$false));
                                    var $96 = $98;
                                };
                                return $96;
                            });
                            var $88 = $95;
                            break;
                        case 'Word.e':
                            var $99 = (_a$pred$8 => {
                                var $100 = Word$e;
                                return $100;
                            });
                            var $88 = $99;
                            break;
                    };
                    var $88 = $88($86);
                    return $88;
                });
                var $85 = $87;
                break;
            case 'Word.i':
                var $101 = self.pred;
                var $102 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $107 = Word$o$(Word$adder$(_a$pred$10, $104, Bool$true));
                                    var $106 = $107;
                                } else {
                                    var $108 = Word$i$(Word$adder$(_a$pred$10, $104, Bool$false));
                                    var $106 = $108;
                                };
                                return $106;
                            });
                            var $103 = $105;
                            break;
                        case 'Word.i':
                            var $109 = self.pred;
                            var $110 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $112 = Word$i$(Word$adder$(_a$pred$10, $109, Bool$true));
                                    var $111 = $112;
                                } else {
                                    var $113 = Word$o$(Word$adder$(_a$pred$10, $109, Bool$true));
                                    var $111 = $113;
                                };
                                return $111;
                            });
                            var $103 = $110;
                            break;
                        case 'Word.e':
                            var $114 = (_a$pred$8 => {
                                var $115 = Word$e;
                                return $115;
                            });
                            var $103 = $114;
                            break;
                    };
                    var $103 = $103($101);
                    return $103;
                });
                var $85 = $102;
                break;
            case 'Word.e':
                var $116 = (_b$5 => {
                    var $117 = Word$e;
                    return $117;
                });
                var $85 = $116;
                break;
        };
        var $85 = $85(_b$3);
        return $85;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $118 = Word$adder$(_a$2, _b$3, Bool$false);
        return $118;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $119 = self.pred;
                        var $120 = Word$mul$go$($119, Word$shift_left1$(_b$4), _acc$5);
                        return $120;
                    case 'Word.i':
                        var $121 = self.pred;
                        var $122 = Word$mul$go$($121, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $122;
                    case 'Word.e':
                        var $123 = _acc$5;
                        return $123;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $125 = self.pred;
                var $126 = Word$o$(Word$to_zero$($125));
                var $124 = $126;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = Word$o$(Word$to_zero$($127));
                var $124 = $128;
                break;
            case 'Word.e':
                var $129 = Word$e;
                var $124 = $129;
                break;
        };
        return $124;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $130 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $130;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $131 = _x$4;
                    return $131;
                } else {
                    var $132 = (self - 1n);
                    var $133 = Nat$apply$($132, _f$3, _f$3(_x$4));
                    return $133;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $135 = self.pred;
                var $136 = Word$i$($135);
                var $134 = $136;
                break;
            case 'Word.i':
                var $137 = self.pred;
                var $138 = Word$o$(Word$inc$($137));
                var $134 = $138;
                break;
            case 'Word.e':
                var $139 = Word$e;
                var $134 = $139;
                break;
        };
        return $134;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $140 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $140;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $141 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $141;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $142 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $142;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kaelin$Constants$room = "0x200000042032";

    function BitsMap$(_A$1) {
        var $143 = null;
        return $143;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $144 = null;
        return $144;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $145 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $145;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $146 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $146;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $148 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $150 = self.val;
                        var $151 = self.lft;
                        var $152 = self.rgt;
                        var $153 = BitsMap$tie$($150, BitsMap$set$($148, _val$3, $151), $152);
                        var $149 = $153;
                        break;
                    case 'BitsMap.new':
                        var $154 = BitsMap$tie$(Maybe$none, BitsMap$set$($148, _val$3, BitsMap$new), BitsMap$new);
                        var $149 = $154;
                        break;
                };
                var $147 = $149;
                break;
            case 'i':
                var $155 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $157 = self.val;
                        var $158 = self.lft;
                        var $159 = self.rgt;
                        var $160 = BitsMap$tie$($157, $158, BitsMap$set$($155, _val$3, $159));
                        var $156 = $160;
                        break;
                    case 'BitsMap.new':
                        var $161 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($155, _val$3, BitsMap$new));
                        var $156 = $161;
                        break;
                };
                var $147 = $156;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $163 = self.lft;
                        var $164 = self.rgt;
                        var $165 = BitsMap$tie$(Maybe$some$(_val$3), $163, $164);
                        var $162 = $165;
                        break;
                    case 'BitsMap.new':
                        var $166 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $162 = $166;
                        break;
                };
                var $147 = $162;
                break;
        };
        return $147;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $168 = self.pred;
                var $169 = (Word$to_bits$($168) + '0');
                var $167 = $169;
                break;
            case 'Word.i':
                var $170 = self.pred;
                var $171 = (Word$to_bits$($170) + '1');
                var $167 = $171;
                break;
            case 'Word.e':
                var $172 = Bits$e;
                var $167 = $172;
                break;
        };
        return $167;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $174 = Bits$e;
            var $173 = $174;
        } else {
            var $175 = self.charCodeAt(0);
            var $176 = self.slice(1);
            var $177 = (String$to_bits$($176) + (u16_to_bits($175)));
            var $173 = $177;
        };
        return $173;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $179 = self.head;
                var $180 = self.tail;
                var self = $179;
                switch (self._) {
                    case 'Pair.new':
                        var $182 = self.fst;
                        var $183 = self.snd;
                        var $184 = BitsMap$set$(String$to_bits$($182), $183, Map$from_list$($180));
                        var $181 = $184;
                        break;
                };
                var $178 = $181;
                break;
            case 'List.nil':
                var $185 = BitsMap$new;
                var $178 = $185;
                break;
        };
        return $178;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $186 = null;
        return $186;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $187 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $187;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function Web$Kaelin$Entity$creature$(_player$1, _hero$2) {
        var $188 = ({
            _: 'Web.Kaelin.Entity.creature',
            'player': _player$1,
            'hero': _hero$2
        });
        return $188;
    };
    const Web$Kaelin$Entity$creature = x0 => x1 => Web$Kaelin$Entity$creature$(x0, x1);

    function Web$Kaelin$Hero$new$(_id$1, _img$2) {
        var $189 = ({
            _: 'Web.Kaelin.Hero.new',
            'id': _id$1,
            'img': _img$2
        });
        return $189;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => Web$Kaelin$Hero$new$(x0, x1);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $190 = _value$3;
                    return $190;
                } else {
                    var $191 = (self - 1n);
                    var $192 = Word$shift_left$($191, Word$shift_left1$(_value$3));
                    return $192;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $194 = Bool$false;
                var $193 = $194;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $195 = Bool$true;
                var $193 = $195;
                break;
        };
        return $193;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $197 = self.pred;
                var $198 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $200 = self.pred;
                            var $201 = (_a$pred$10 => {
                                var $202 = Word$cmp$go$(_a$pred$10, $200, _c$4);
                                return $202;
                            });
                            var $199 = $201;
                            break;
                        case 'Word.i':
                            var $203 = self.pred;
                            var $204 = (_a$pred$10 => {
                                var $205 = Word$cmp$go$(_a$pred$10, $203, Cmp$ltn);
                                return $205;
                            });
                            var $199 = $204;
                            break;
                        case 'Word.e':
                            var $206 = (_a$pred$8 => {
                                var $207 = _c$4;
                                return $207;
                            });
                            var $199 = $206;
                            break;
                    };
                    var $199 = $199($197);
                    return $199;
                });
                var $196 = $198;
                break;
            case 'Word.i':
                var $208 = self.pred;
                var $209 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $211 = self.pred;
                            var $212 = (_a$pred$10 => {
                                var $213 = Word$cmp$go$(_a$pred$10, $211, Cmp$gtn);
                                return $213;
                            });
                            var $210 = $212;
                            break;
                        case 'Word.i':
                            var $214 = self.pred;
                            var $215 = (_a$pred$10 => {
                                var $216 = Word$cmp$go$(_a$pred$10, $214, _c$4);
                                return $216;
                            });
                            var $210 = $215;
                            break;
                        case 'Word.e':
                            var $217 = (_a$pred$8 => {
                                var $218 = _c$4;
                                return $218;
                            });
                            var $210 = $217;
                            break;
                    };
                    var $210 = $210($208);
                    return $210;
                });
                var $196 = $209;
                break;
            case 'Word.e':
                var $219 = (_b$5 => {
                    var $220 = _c$4;
                    return $220;
                });
                var $196 = $219;
                break;
        };
        var $196 = $196(_b$3);
        return $196;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $221 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $221;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $222 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $222;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $223 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $223;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $225 = self.pred;
                var $226 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $228 = self.pred;
                            var $229 = (_a$pred$9 => {
                                var $230 = Word$o$(Word$or$(_a$pred$9, $228));
                                return $230;
                            });
                            var $227 = $229;
                            break;
                        case 'Word.i':
                            var $231 = self.pred;
                            var $232 = (_a$pred$9 => {
                                var $233 = Word$i$(Word$or$(_a$pred$9, $231));
                                return $233;
                            });
                            var $227 = $232;
                            break;
                        case 'Word.e':
                            var $234 = (_a$pred$7 => {
                                var $235 = Word$e;
                                return $235;
                            });
                            var $227 = $234;
                            break;
                    };
                    var $227 = $227($225);
                    return $227;
                });
                var $224 = $226;
                break;
            case 'Word.i':
                var $236 = self.pred;
                var $237 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $239 = self.pred;
                            var $240 = (_a$pred$9 => {
                                var $241 = Word$i$(Word$or$(_a$pred$9, $239));
                                return $241;
                            });
                            var $238 = $240;
                            break;
                        case 'Word.i':
                            var $242 = self.pred;
                            var $243 = (_a$pred$9 => {
                                var $244 = Word$i$(Word$or$(_a$pred$9, $242));
                                return $244;
                            });
                            var $238 = $243;
                            break;
                        case 'Word.e':
                            var $245 = (_a$pred$7 => {
                                var $246 = Word$e;
                                return $246;
                            });
                            var $238 = $245;
                            break;
                    };
                    var $238 = $238($236);
                    return $238;
                });
                var $224 = $237;
                break;
            case 'Word.e':
                var $247 = (_b$4 => {
                    var $248 = Word$e;
                    return $248;
                });
                var $224 = $247;
                break;
        };
        var $224 = $224(_b$3);
        return $224;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $250 = self.pred;
                var $251 = Word$o$(Word$shift_right1$aux$($250));
                var $249 = $251;
                break;
            case 'Word.i':
                var $252 = self.pred;
                var $253 = Word$i$(Word$shift_right1$aux$($252));
                var $249 = $253;
                break;
            case 'Word.e':
                var $254 = Word$o$(Word$e);
                var $249 = $254;
                break;
        };
        return $249;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $256 = self.pred;
                var $257 = Word$shift_right1$aux$($256);
                var $255 = $257;
                break;
            case 'Word.i':
                var $258 = self.pred;
                var $259 = Word$shift_right1$aux$($258);
                var $255 = $259;
                break;
            case 'Word.e':
                var $260 = Word$e;
                var $255 = $260;
                break;
        };
        return $255;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $262 = self.pred;
                var $263 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $265 = self.pred;
                            var $266 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $268 = Word$i$(Word$subber$(_a$pred$10, $265, Bool$true));
                                    var $267 = $268;
                                } else {
                                    var $269 = Word$o$(Word$subber$(_a$pred$10, $265, Bool$false));
                                    var $267 = $269;
                                };
                                return $267;
                            });
                            var $264 = $266;
                            break;
                        case 'Word.i':
                            var $270 = self.pred;
                            var $271 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $273 = Word$o$(Word$subber$(_a$pred$10, $270, Bool$true));
                                    var $272 = $273;
                                } else {
                                    var $274 = Word$i$(Word$subber$(_a$pred$10, $270, Bool$true));
                                    var $272 = $274;
                                };
                                return $272;
                            });
                            var $264 = $271;
                            break;
                        case 'Word.e':
                            var $275 = (_a$pred$8 => {
                                var $276 = Word$e;
                                return $276;
                            });
                            var $264 = $275;
                            break;
                    };
                    var $264 = $264($262);
                    return $264;
                });
                var $261 = $263;
                break;
            case 'Word.i':
                var $277 = self.pred;
                var $278 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $280 = self.pred;
                            var $281 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $283 = Word$o$(Word$subber$(_a$pred$10, $280, Bool$false));
                                    var $282 = $283;
                                } else {
                                    var $284 = Word$i$(Word$subber$(_a$pred$10, $280, Bool$false));
                                    var $282 = $284;
                                };
                                return $282;
                            });
                            var $279 = $281;
                            break;
                        case 'Word.i':
                            var $285 = self.pred;
                            var $286 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $288 = Word$i$(Word$subber$(_a$pred$10, $285, Bool$true));
                                    var $287 = $288;
                                } else {
                                    var $289 = Word$o$(Word$subber$(_a$pred$10, $285, Bool$false));
                                    var $287 = $289;
                                };
                                return $287;
                            });
                            var $279 = $286;
                            break;
                        case 'Word.e':
                            var $290 = (_a$pred$8 => {
                                var $291 = Word$e;
                                return $291;
                            });
                            var $279 = $290;
                            break;
                    };
                    var $279 = $279($277);
                    return $279;
                });
                var $261 = $278;
                break;
            case 'Word.e':
                var $292 = (_b$5 => {
                    var $293 = Word$e;
                    return $293;
                });
                var $261 = $292;
                break;
        };
        var $261 = $261(_b$3);
        return $261;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $294 = Word$subber$(_a$2, _b$3, Bool$false);
        return $294;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $295 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $295;
                } else {
                    var $296 = Pair$new$(Bool$false, _value$5);
                    var self = $296;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $297 = self.fst;
                        var $298 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $300 = $298;
                            var $299 = $300;
                        } else {
                            var $301 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $297;
                            if (self) {
                                var $303 = Word$div$go$($301, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $298);
                                var $302 = $303;
                            } else {
                                var $304 = Word$div$go$($301, _sub_copy$3, _new_shift_copy$9, $298);
                                var $302 = $304;
                            };
                            var $299 = $302;
                        };
                        return $299;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $306 = Word$to_zero$(_a$2);
            var $305 = $306;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $307 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $305 = $307;
        };
        return $305;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $309 = Bool$false;
                var $308 = $309;
                break;
            case 'Cmp.eql':
                var $310 = Bool$true;
                var $308 = $310;
                break;
        };
        return $308;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $311 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $311;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$slice$(_a$2, _b$3, _str$4) {
        var Word$slice$ = (_a$2, _b$3, _str$4) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3, _str$4]
        });
        var Word$slice = _a$2 => _b$3 => _str$4 => Word$slice$(_a$2, _b$3, _str$4);
        var arg = [_a$2, _b$3, _str$4];
        while (true) {
            let [_a$2, _b$3, _str$4] = arg;
            var R = Word$slice$(_a$2, _b$3, _str$4);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$slice = x0 => x1 => x2 => Word$slice$(x0, x1, x2);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $312 = (parseInt(_chr$3, 16));
        return $312;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $314 = Word$e;
            var $313 = $314;
        } else {
            var $315 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $317 = self.pred;
                    var $318 = Word$o$(Word$trim$($315, $317));
                    var $316 = $318;
                    break;
                case 'Word.i':
                    var $319 = self.pred;
                    var $320 = Word$i$(Word$trim$($315, $319));
                    var $316 = $320;
                    break;
                case 'Word.e':
                    var $321 = Word$o$(Word$trim$($315, Word$e));
                    var $316 = $321;
                    break;
            };
            var $313 = $316;
        };
        return $313;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $323 = self.value;
                var $324 = $323;
                var $322 = $324;
                break;
            case 'Array.tie':
                var $325 = Unit$new;
                var $322 = $325;
                break;
        };
        return $322;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $327 = self.lft;
                var $328 = self.rgt;
                var $329 = Pair$new$($327, $328);
                var $326 = $329;
                break;
            case 'Array.tip':
                var $330 = Unit$new;
                var $326 = $330;
                break;
        };
        return $326;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $331 = self.pred;
                        var $332 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $331);
                        return $332;
                    case 'Word.i':
                        var $333 = self.pred;
                        var $334 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $333);
                        return $334;
                    case 'Word.e':
                        var $335 = _nil$3;
                        return $335;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $336 = Word$foldl$((_arr$6 => {
            var $337 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $337;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $339 = self.fst;
                    var $340 = self.snd;
                    var $341 = Array$tie$(_rec$7($339), $340);
                    var $338 = $341;
                    break;
            };
            return $338;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $343 = self.fst;
                    var $344 = self.snd;
                    var $345 = Array$tie$($343, _rec$7($344));
                    var $342 = $345;
                    break;
            };
            return $342;
        }), _idx$3)(_arr$5);
        return $336;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $346 = Array$mut$(_idx$3, (_x$6 => {
            var $347 = _val$4;
            return $347;
        }), _arr$5);
        return $346;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $349 = self.capacity;
                var $350 = self.buffer;
                var $351 = VoxBox$new$(_length$1, $349, $350);
                var $348 = $351;
                break;
        };
        return $348;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $353 = _img$3;
            var $354 = 0;
            var $355 = _siz$2;
            let _img$5 = $353;
            for (let _i$4 = $354; _i$4 < $355; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $353 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $353;
            };
            return _img$5;
        })();
        var $352 = _img$4;
        return $352;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Web$Kaelin$Hero$croni = Web$Kaelin$Hero$new$("0x00000001", Web$Kaelin$Assets$hero$croni0_d_1);
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Hero$cyclope = Web$Kaelin$Hero$new$("0x00000002", Web$Kaelin$Assets$hero$cyclope_d_1);
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Hero$lela = Web$Kaelin$Hero$new$("0x00000003", Web$Kaelin$Assets$hero$lela_d_1);
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const Web$Kaelin$Hero$octoking = Web$Kaelin$Hero$new$("0x00000004", Web$Kaelin$Assets$hero$octoking_d_1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $357 = self.value;
                var $358 = $357;
                var $356 = $358;
                break;
            case 'Maybe.none':
                var $359 = _a$3;
                var $356 = $359;
                break;
        };
        return $356;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$(_A$1) {
        var $360 = null;
        return $360;
    };
    const List = x0 => List$(x0);

    function I32$new$(_value$1) {
        var $361 = word_to_i32(_value$1);
        return $361;
    };
    const I32$new = x0 => I32$new$(x0);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $363 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $365 = Word$o$(Word$neg$aux$($363, Bool$true));
                    var $364 = $365;
                } else {
                    var $366 = Word$i$(Word$neg$aux$($363, Bool$false));
                    var $364 = $366;
                };
                var $362 = $364;
                break;
            case 'Word.i':
                var $367 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $369 = Word$i$(Word$neg$aux$($367, Bool$false));
                    var $368 = $369;
                } else {
                    var $370 = Word$o$(Word$neg$aux$($367, Bool$false));
                    var $368 = $370;
                };
                var $362 = $368;
                break;
            case 'Word.e':
                var $371 = Word$e;
                var $362 = $371;
                break;
        };
        return $362;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $373 = self.pred;
                var $374 = Word$o$(Word$neg$aux$($373, Bool$true));
                var $372 = $374;
                break;
            case 'Word.i':
                var $375 = self.pred;
                var $376 = Word$i$(Word$neg$aux$($375, Bool$false));
                var $372 = $376;
                break;
            case 'Word.e':
                var $377 = Word$e;
                var $372 = $377;
                break;
        };
        return $372;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));

    function Int$to_i32$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $379 = int_pos(self);
                var $380 = int_neg(self);
                var self = $380;
                if (self === 0n) {
                    var $382 = I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $379));
                    var $381 = $382;
                } else {
                    var $383 = (self - 1n);
                    var $384 = ((-I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $380))));
                    var $381 = $384;
                };
                var $378 = $381;
                break;
        };
        return $378;
    };
    const Int$to_i32 = x0 => Int$to_i32$(x0);
    const Int$new = a0 => a1 => (a0 - a1);

    function Int$from_nat$(_n$1) {
        var $385 = (_n$1 - 0n);
        return $385;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Int$to_nat$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $387 = int_pos(self);
                var $388 = $387;
                var $386 = $388;
                break;
        };
        return $386;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function Word$is_neg$go$(_word$2, _n$3) {
        var Word$is_neg$go$ = (_word$2, _n$3) => ({
            ctr: 'TCO',
            arg: [_word$2, _n$3]
        });
        var Word$is_neg$go = _word$2 => _n$3 => Word$is_neg$go$(_word$2, _n$3);
        var arg = [_word$2, _n$3];
        while (true) {
            let [_word$2, _n$3] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $389 = self.pred;
                        var $390 = Word$is_neg$go$($389, Bool$false);
                        return $390;
                    case 'Word.i':
                        var $391 = self.pred;
                        var $392 = Word$is_neg$go$($391, Bool$true);
                        return $392;
                    case 'Word.e':
                        var $393 = _n$3;
                        return $393;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $394 = Word$is_neg$go$(_word$2, Bool$false);
        return $394;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $396 = self.pred;
                var $397 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $396));
                var $395 = $397;
                break;
            case 'Word.i':
                var $398 = self.pred;
                var $399 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $398));
                var $395 = $399;
                break;
            case 'Word.e':
                var $400 = _nil$3;
                var $395 = $400;
                break;
        };
        return $395;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $401 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $402 = Nat$succ$((2n * _x$4));
            return $402;
        }), _word$2);
        return $401;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $404 = Word$neg$(_a$2);
            var $403 = $404;
        } else {
            var $405 = _a$2;
            var $403 = $405;
        };
        return $403;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $407 = int_pos(self);
                var $408 = int_neg(self);
                var $409 = ($408 - $407);
                var $406 = $409;
                break;
        };
        return $406;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = Int$from_nat$(Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $411 = Int$neg$(_i$4);
            var $410 = $411;
        } else {
            var $412 = _i$4;
            var $410 = $412;
        };
        return $410;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $414 = i32_to_word(self);
                var $415 = Word$to_int$($414);
                var $413 = $415;
                break;
        };
        return $413;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $417 = self.i;
                var $418 = self.j;
                var _i$4 = (($417 + Int$to_i32$(Int$from_nat$(1000n))) >> 0);
                var _i$5 = ((_i$4 * Int$to_i32$(Int$from_nat$(10000n))) >> 0);
                var _i$6 = Int$to_nat$(I32$to_int$(_i$5));
                var _j$7 = (($418 + Int$to_i32$(Int$from_nat$(1000n))) >> 0);
                var _j$8 = Int$to_nat$(I32$to_int$(_j$7));
                var $419 = (_i$6 + _j$8);
                var $416 = $419;
                break;
        };
        return $416;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Maybe$(_A$1) {
        var $420 = null;
        return $420;
    };
    const Maybe = x0 => Maybe$(x0);

    function BitsMap$get$(_bits$2, _map$3) {
        var BitsMap$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var BitsMap$get = _bits$2 => _map$3 => BitsMap$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $421 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $423 = self.lft;
                                var $424 = BitsMap$get$($421, $423);
                                var $422 = $424;
                                break;
                            case 'BitsMap.new':
                                var $425 = Maybe$none;
                                var $422 = $425;
                                break;
                        };
                        return $422;
                    case 'i':
                        var $426 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $428 = self.rgt;
                                var $429 = BitsMap$get$($426, $428);
                                var $427 = $429;
                                break;
                            case 'BitsMap.new':
                                var $430 = Maybe$none;
                                var $427 = $430;
                                break;
                        };
                        return $427;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $432 = self.val;
                                var $433 = $432;
                                var $431 = $433;
                                break;
                            case 'BitsMap.new':
                                var $434 = Maybe$none;
                                var $431 = $434;
                                break;
                        };
                        return $431;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $436 = self.slice(0, -1);
                var $437 = ($436 + '1');
                var $435 = $437;
                break;
            case 'i':
                var $438 = self.slice(0, -1);
                var $439 = (Bits$inc$($438) + '0');
                var $435 = $439;
                break;
            case 'e':
                var $440 = (Bits$e + '1');
                var $435 = $440;
                break;
        };
        return $435;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $441 = BitsMap$get$((nat_to_bits(_key$2)), _map$3);
        return $441;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $442 = NatMap$get$(_key$3, _map$2);
        return $442;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $443 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $443;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $444 = BitsMap$set$((nat_to_bits(_key$2)), _val$3, _map$4);
        return $444;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $445 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $445;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$3), List$nil);
        var _tile$5 = List$cons$(_entity$2, _tile$4);
        var $446 = Web$Kaelin$Map$set$(_coord$1, _tile$5, _map$3);
        return $446;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Map$init$(_map$1) {
        var _new_coord$2 = Web$Kaelin$Coord$new;
        var _creature$3 = Web$Kaelin$Entity$creature;
        var _croni$4 = Web$Kaelin$Hero$croni;
        var _cyclope$5 = Web$Kaelin$Hero$cyclope;
        var _lela$6 = Web$Kaelin$Hero$lela;
        var _octoking$7 = Web$Kaelin$Hero$octoking;
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$neg$(Int$from_nat$(1n))))(Int$to_i32$(Int$neg$(Int$from_nat$(2n)))), _creature$3(Maybe$none)(_croni$4), _map$1);
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$from_nat$(0n)))(Int$to_i32$(Int$from_nat$(3n))), _creature$3(Maybe$none)(_cyclope$5), _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$neg$(Int$from_nat$(2n))))(Int$to_i32$(Int$from_nat$(0n))), _creature$3(Maybe$none)(_lela$6), _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$from_nat$(3n)))(Int$to_i32$(Int$neg$(Int$from_nat$(2n)))), _creature$3(Maybe$none)(_octoking$7), _map$10);
        var $447 = _map$11;
        return $447;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const NatMap$new = BitsMap$new;
    const Web$Kaelin$Constants$map_size = 5;

    function Web$Kaelin$Terrain$grass$(_normal$1, _ability$2, _movement$3) {
        var $448 = ({
            _: 'Web.Kaelin.Terrain.grass',
            'normal': _normal$1,
            'ability': _ability$2,
            'movement': _movement$3
        });
        return $448;
    };
    const Web$Kaelin$Terrain$grass = x0 => x1 => x2 => Web$Kaelin$Terrain$grass$(x0, x1, x2);
    const Web$Kaelin$Assets$tile$dark_grass_4 = VoxBox$parse$("0e00010600000f00010600001000010600000c01010600000d01010600000e0101408d640f0101408d64100101469e651101010600001201010600000a02010600000b02010600000c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302010600001402010600000803010600000903010600000a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301060000160301060000060401060000070401060000080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401060000180401060000040501060000050501060000060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905010600001a0501060000020601060000030601060000040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06010600001c0601060000000701060000010701060000020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07010600001e0701060000000801060000010801347e57020801469e65030801469e65040801408d64050801408d64060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801469e650d0801469e650e0801469e650f0801347e57100801347e57110801469e65120801469e65130801408d64140801408d64150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801469e651c0801469e651d0801469e651e0801060000000901060000010901408d64020901469e65030901469e65040901408d64050901469e65060901469e65070901469e65080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901347e57100901408d64110901469e65120901469e65130901408d64140901469e65150901469e65160901469e65170901408d64180901469e65190901469e651a0901408d641b0901408d641c0901469e651d0901469e651e0901060000000a01060000010a01408d64020a01408d64030a01408d64040a01408d64050a01469e65060a01469e65070a01408d64080a01408d64090a01408d640a0a01408d640b0a01408d640c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01469e65150a01469e65160a01408d64170a01408d64180a01408d64190a01408d641a0a01408d641b0a01408d641c0a01408d641d0a01408d641e0a01060000000b01060000010b01408d64020b01408d64030b01408d64040b01408d64050b01408d64060b01408d64070b01469e65080b01469e65090b01408d640a0b01347e570b0b01347e570c0b01408d640d0b01408d640e0b01408d640f0b01469e65100b01408d64110b01408d64120b01408d64130b01408d64140b01408d64150b01408d64160b01469e65170b01469e65180b01408d64190b01347e571a0b01347e571b0b01408d641c0b01408d641d0b01408d641e0b01060000000c01060000010c01408d64020c01408d64030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01469e65090c01408d640a0c01347e570b0c01408d640c0c01469e650d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01469e65180c01408d64190c01347e571a0c01408d641b0c01469e651c0c01469e651d0c01408d641e0c01060000000d01060000010d01408d64020d01469e65030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01469e650d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01408d64180d01408d64190d01408d641a0d01408d641b0d01469e651c0d01469e651d0d01469e651e0d01060000000e01060000010e01408d64020e01469e65030e01469e65040e01408d64050e01408d64060e01408d64070e01408d64080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01408d640d0e01469e650e0e01469e650f0e01408d64100e01408d64110e01469e65120e01469e65130e01408d64140e01408d64150e01408d64160e01408d64170e01408d64180e01408d64190e01408d641a0e01408d641b0e01408d641c0e01469e651d0e01469e651e0e01060000000f01060000010f01408d64020f01469e65030f01469e65040f01408d64050f01347e57060f01408d64070f01469e65080f01469e65090f01469e650a0f01408d640b0f01469e650c0f01469e650d0f01408d640e0f01408d640f0f01469e65100f01408d64110f01469e65120f01469e65130f01408d64140f01347e57150f01408d64160f01469e65170f01469e65180f01469e65190f01408d641a0f01469e651b0f01469e651c0f01408d641d0f01408d641e0f01060000001001060000011001469e65021001469e65031001469e65041001408d64051001408d64061001408d64071001469e65081001469e65091001408d640a1001408d640b1001408d640c1001408d640d1001408d640e1001408d640f1001408d64101001469e65111001469e65121001469e65131001408d64141001408d64151001408d64161001469e65171001469e65181001408d64191001408d641a1001408d641b1001408d641c1001408d641d1001408d641e1001060000001101060000011101469e65021101469e65031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101408d640a1101408d640b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101469e65111101469e65121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101408d64191101408d641a1101408d641b1101469e651c1101469e651d1101469e651e1101060000001201060000011201408d64021201408d64031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201469e650a1201469e650b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201408d64111201408d64121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201469e65191201469e651a1201408d641b1201469e651c1201469e651d1201469e651e1201060000001301060000011301469e65021301408d64031301408d64041301408d64051301408d64061301408d64071301408d64081301469e65091301469e650a1301469e650b1301408d640c1301408d640d1301469e650e1301469e650f1301408d64101301469e65111301408d64121301408d64131301408d64141301408d64151301408d64161301408d64171301469e65181301469e65191301469e651a1301408d641b1301408d641c1301469e651d1301469e651e1301060000001401060000011401469e65021401469e65031401347e57041401408d64051401469e65061401469e65071401408d64081401469e65091401469e650a1401408d640b1401408d640c1401408d640d1401347e570e1401347e570f1401469e65101401469e65111401469e65121401347e57131401408d64141401469e65151401469e65161401408d64171401469e65181401469e65191401408d641a1401408d641b1401408d641c1401347e571d1401347e571e1401060000001501060000011501469e65021501408d64031501347e57041501347e57051501469e65061501469e65071501408d64081501408d64091501347e570a1501408d640b1501408d640c1501408d640d1501408d640e1501347e570f1501469e65101501469e65111501408d64121501347e57131501347e57141501469e65151501469e65161501408d64171501408d64181501347e57191501408d641a1501408d641b1501408d641c1501408d641d1501347e571e1501060000001601060000011601060000021601408d64031601408d64041601408d64051601408d64061601408d64071601408d64081601408d64091601347e570a1601347e570b1601408d640c1601469e650d1601469e650e1601408d640f1601408d64101601408d64111601408d64121601408d64131601408d64141601408d64151601408d64161601408d64171601408d64181601347e57191601347e571a1601408d641b1601469e651c1601469e651d16010600001e1601060000021701060000031701060000041701408d64051701408d64061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701469e650d1701469e650e1701469e650f1701347e57101701347e57111701469e65121701469e65131701408d64141701408d64151701469e65161701469e65171701408d64181701469e65191701469e651a1701408d641b17010600001c1701060000041801060000051801060000061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801408d640d1801469e650e1801469e650f1801347e57101801408d64111801469e65121801469e65131801408d64141801469e65151801469e65161801469e65171801408d64181801469e651918010600001a1801060000061901060000071901060000081901408d64091901408d640a1901408d640b1901408d640c1901408d640d1901408d640e1901408d640f1901408d64101901408d64111901408d64121901408d64131901408d64141901469e65151901469e65161901408d64171901060000181901060000081a01060000091a010600000a1a01347e570b1a01347e570c1a01408d640d1a01408d640e1a01408d640f1a01469e65101a01408d64111a01408d64121a01408d64131a01408d64141a01408d64151a01060000161a010600000a1b010600000b1b010600000c1b01469e650d1b01469e650e1b01408d640f1b01469e65101b01408d64111b01408d64121b01469e65131b01060000141b010600000c1c010600000d1c010600000e1c01469e650f1c01408d64101c01408d64111c01060000121c010600000e1d010600000f1d01060000101d01060000");
    const Web$Kaelin$Assets$tile$hex_range = VoxBox$parse$("0e00023d15150f00023d15151000023d15150c01023d15150d01023d15150e010298755e0f01028e675610010298755e1101023d15151201023d15150a02023d15150b02023d15150c020298755e0d020298755e0e020298755e0f02028e67561002028e67561102028e67561202028e67561302023d15151402023d15150803023d15150903023d15150a030298755e0b03028e67560c03028e67560d030298755e0e030298755e0f03028e675610030298755e1103028e67561203028e67561303028e67561403028e67561503023d15151603023d15150604023d15150704023d151508040298755e09040298755e0a04028e67560b04028e67560c04028e67560d04028159490e04028159490f040298755e10040298755e11040298755e1204028159491304028e675614040298755e15040298755e1604028e67561704023d15151804023d15150405023d15150505023d151506050298755e0705028e67560805028e67560905028159490a05028e67560b05028e67560c05028e67560d05028e67560e05028159490f050298755e10050298755e1105028e675612050281594913050281594914050298755e15050298755e1605028e67561705028e67561805028159491905023d15151a05023d15150206023d15150306023d15150406028e67560506028e67560606028e67560706028e67560806028e67560906028159490a06028159490b06028e67560c060298755e0d060298755e0e06028e67560f06028e67561006028e67561106028e67561206028e67561306028e67561406028e67561506028e67561606028e67561706028e67561806028159491906028159491a06028e67561b06023d15151c06023d15150007023d15150107023d151502070298755e03070298755e0407028e67560507028e675606070298755e07070298755e0807028e675609070298755e0a070298755e0b07028e67560c070298755e0d070298755e0e070298755e0f070281594910070281594911070298755e12070298755e1307028e67561407028e675615070298755e16070298755e1707028e675618070298755e19070298755e1a07028e67561b070298755e1c070298755e1d07023d15151e07023d15150008023d15150108028e675602080298755e03080298755e0408028e675605080298755e06080298755e07080298755e0808028e675609080298755e0a080298755e0b08028e67560c08028e67560d080298755e0e080298755e0f08028159491008028e675611080298755e12080298755e1308028e675614080298755e15080298755e16080298755e1708028e675618080298755e19080298755e1a08028e67561b08028e67561c080298755e1d080298755e1e08023d15150009023d15150109028e67560209028e67560309028e67560409028e675605090298755e06090298755e0709028e67560809028e67560909028e67560a09028e67560b09028e67560c09028e67560d09028e67560e09028e67560f09028e67561009028e67561109028e67561209028e67561309028e675614090298755e15090298755e1609028e67561709028e67561809028e67561909028e67561a09028e67561b09028e67561c09028e67561d09028e67561e09023d1515000a023d1515010a028e6756020a028e6756030a028e6756040a028e6756050a028e6756060a028e6756070a0298755e080a0298755e090a028e67560a0a028159490b0a028159490c0a028e67560d0a028e67560e0a028e67560f0a0298755e100a028e6756110a028e6756120a028e6756130a028e6756140a028e6756150a028e6756160a0298755e170a0298755e180a028e6756190a028159491a0a028159491b0a028e67561c0a028e67561d0a028e67561e0a023d1515000b023d1515010b028e6756020b028e6756030b0298755e040b0298755e050b028e6756060b0298755e070b0298755e080b0298755e090b028e67560a0b028159490b0b028e67560c0b0298755e0d0b0298755e0e0b028e67560f0b0298755e100b028e6756110b028e6756120b0298755e130b0298755e140b028e6756150b0298755e160b0298755e170b0298755e180b028e6756190b028159491a0b028e67561b0b0298755e1c0b0298755e1d0b028e67561e0b023d1515000c023d1515010c028e6756020c0298755e030c0298755e040c0298755e050c028e6756060c0298755e070c0298755e080c028e6756090c028e67560a0c028e67560b0c028e67560c0c0298755e0d0c0298755e0e0c0298755e0f0c028e6756100c028e6756110c0298755e120c0298755e130c0298755e140c028e6756150c0298755e160c0298755e170c028e6756180c028e6756190c028e67561a0c028e67561b0c0298755e1c0c0298755e1d0c0298755e1e0c023d1515000d023d1515010d028e6756020d0298755e030d0298755e040d028e6756050d028e6756060d028e6756070d028e6756080d028e6756090d028e67560a0d028e67560b0d028e67560c0d028e67560d0d0298755e0e0d0298755e0f0d028e6756100d028e6756110d0298755e120d0298755e130d028e6756140d028e6756150d028e6756160d028e6756170d028e6756180d028e6756190d028e67561a0d028e67561b0d028e67561c0d0298755e1d0d0298755e1e0d023d1515000e023d1515010e028e6756020e0298755e030e0298755e040e028e6756050e02815949060e028e6756070e0298755e080e0298755e090e0298755e0a0e028e67560b0e0298755e0c0e0298755e0d0e028e67560e0e028e67560f0e0298755e100e028e6756110e0298755e120e0298755e130e028e6756140e02815949150e028e6756160e0298755e170e0298755e180e0298755e190e028e67561a0e0298755e1b0e0298755e1c0e028e67561d0e028e67561e0e023d1515000f023d1515010f028e6756020f0298755e030f0298755e040f028e6756050f02815949060f028e6756070f0298755e080f0298755e090f0298755e0a0f028e67560b0f0298755e0c0f0298755e0d0f028e67560e0f028e67560f0f0298755e100f028e6756110f0298755e120f0298755e130f028e6756140f02815949150f028e6756160f0298755e170f0298755e180f0298755e190f028e67561a0f0298755e1b0f0298755e1c0f028e67561d0f028e67561e0f023d15150010023d151501100298755e02100298755e03100298755e0410028e67560510028e67560610028e675607100298755e08100298755e0910028e67560a100298755e0b100298755e0c10028e67560d10028e67560e10028e67560f10028e675610100298755e11100298755e12100298755e1310028e67561410028e675615100298755e16100298755e17100298755e1810028e67561910028e67561a10028e67561b10028e67561c10028e67561d10028e67561e10023d15150011023d151501110298755e02110298755e0311028e67560411028e675605110298755e06110298755e0711028e67560811028e67560911028e67560a11028e67560b11028e67560c110298755e0d110298755e0e110298755e0f110281594910110298755e1111028e67561211028e675613110298755e14110298755e15110298755e1611028e67561711028e67561811028159491911028e67561a11028e67561b110298755e1c110298755e1d110298755e1e11023d15150012023d15150112028e67560212028e67560312028e675604120298755e05120298755e0612028e67560712028e675608120281594909120298755e0a120298755e0b12028e67560c120298755e0d120298755e0e120298755e0f12028e67561012028e675611120298755e1212028e675613120298755e14120298755e1512028e67561612028e67561712028e675618120298755e19120298755e1a12028e67561b120298755e1c120298755e1d120298755e1e12023d15150013023d151501130298755e0213028e67560313028e67560413028e67560513028e67560613028e67560713028e675608130298755e09130298755e0a130298755e0b130298755e0c13028e67560d130298755e0e130298755e0f13028e675610130298755e1113028e67561213028e67561313028e67561413028e67561513028e675616130298755e17130298755e1813028e675619130298755e1a13028e67561b13028e67561c130298755e1d130298755e1e13023d15150014023d151501140298755e02140298755e0314028159490414028e675605140298755e06140298755e0714028e675608140298755e09140298755e0a14028e67560b14028e67560c14028e67560d14028159490e14028159490f140298755e10140298755e11140298755e1214028159491314028e675614140298755e15140298755e1614028e675617140298755e18140298755e1914028e67561a14028e67561b14028e67561c14028159491d14028159491e14023d15150015023d151501150298755e0215028e675603150281594904150281594905150298755e06150298755e0715028e67560815028e67560915028159490a15028e67560b15028e67560c15028e67560d15028e67560e15028159490f150298755e10150298755e1115028e675612150281594913150281594914150298755e15150298755e1615028e67561715028e67561815028159491915028e67561a15028e67561b15028e67561c15028e67561d15028159491e15023d15150016023d15150116023d15150216028e67560316028e67560416028e67560516028e67560616028e67560716028e67560816028e67560916028159490a16028159490b16028e67560c160298755e0d160298755e0e16028e67560f16028e67561016028e67561116028e67561216028e67561316028e67561416028e67561516028e67561616028e67561716028e67561816028159491916028159491a16028e67561b160298755e1c160298755e1d16023d15151e16023d15150217023d15150317023d15150417028e67560517028e675606170298755e07170298755e0817028e675609170298755e0a170298755e0b17028e67560c170298755e0d170298755e0e170298755e0f170281594910170281594911170298755e12170298755e1317028e67561417028e675615170298755e16170298755e1717028e675618170298755e19170298755e1a17028e67561b17023d15151c17023d15150418023d15150518023d151506180298755e07180298755e0818028e675609180298755e0a180298755e0b18028e67560c18028e67560d180298755e0e180298755e0f18028159491018028e675611180298755e12180298755e1318028e675614180298755e15180298755e16180298755e1718028e675618180298755e1918023d15151a18023d15150619023d15150719023d15150819028e67560919028e67560a19028e67560b19028e67560c19028e67560d19028e67560e19028e67560f19028e67561019028e67561119028e67561219028e67561319028e675614190298755e15190298755e1619028e67561719023d15151819023d1515081a023d1515091a023d15150a1a028159490b1a028159490c1a028e67560d1a028e67560e1a028e67560f1a0298755e101a028e6756111a028e6756121a028e6756131a028e6756141a028e6756151a023d1515161a023d15150a1b023d15150b1b023d15150c1b0298755e0d1b0298755e0e1b028e67560f1b0298755e101b028e6756111b028e6756121b0298755e131b023d1515141b023d15150c1c023d15150d1c023d15150e1c0298755e0f1c028e6756101c028e6756111c023d1515121c023d15150e1d023d15150f1d023d1515101d023d1515");
    const Web$Kaelin$Assets$tile$hex_hovered = VoxBox$parse$("0e0002700a0a0f0002700a0a100002700a0a0c0102700a0a0d0102700a0a0e0102d258580f0102c64c4c100102d25858110102700a0a120102700a0a0a0202700a0a0b0202700a0a0c0202d258580d0202d258580e0202d258580f0202c64c4c100202c64c4c110202c64c4c120202c64c4c130202700a0a140202700a0a080302700a0a090302700a0a0a0302d258580b0302c64c4c0c0302c64c4c0d0302d258580e0302d258580f0302c64c4c100302d25858110302c64c4c120302c64c4c130302c64c4c140302c64c4c150302700a0a160302700a0a060402700a0a070402700a0a080402d25858090402d258580a0402c64c4c0b0402c64c4c0c0402c64c4c0d0402b83e3e0e0402b83e3e0f0402d25858100402d25858110402d25858120402b83e3e130402c64c4c140402d25858150402d25858160402c64c4c170402700a0a180402700a0a040502700a0a050502700a0a060502d25858070502c64c4c080502c64c4c090502b83e3e0a0502c64c4c0b0502c64c4c0c0502c64c4c0d0502c64c4c0e0502b83e3e0f0502d25858100502d25858110502c64c4c120502b83e3e130502b83e3e140502d25858150502d25858160502c64c4c170502c64c4c180502b83e3e190502700a0a1a0502700a0a020602700a0a030602700a0a040602c64c4c050602c64c4c060602c64c4c070602c64c4c080602c64c4c090602b83e3e0a0602b83e3e0b0602c64c4c0c0602d258580d0602d258580e0602c64c4c0f0602c64c4c100602c64c4c110602c64c4c120602c64c4c130602c64c4c140602c64c4c150602c64c4c160602c64c4c170602c64c4c180602b83e3e190602b83e3e1a0602c64c4c1b0602700a0a1c0602700a0a000702700a0a010702700a0a020702d25858030702d25858040702c64c4c050702c64c4c060702d25858070702d25858080702c64c4c090702d258580a0702d258580b0702c64c4c0c0702d258580d0702d258580e0702d258580f0702b83e3e100702b83e3e110702d25858120702d25858130702c64c4c140702c64c4c150702d25858160702d25858170702c64c4c180702d25858190702d258581a0702c64c4c1b0702d258581c0702d258581d0702700a0a1e0702700a0a000802700a0a010802c64c4c020802d25858030802d25858040802c64c4c050802d25858060802d25858070802d25858080802c64c4c090802d258580a0802d258580b0802c64c4c0c0802c64c4c0d0802d258580e0802d258580f0802b83e3e100802c64c4c110802d25858120802d25858130802c64c4c140802d25858150802d25858160802d25858170802c64c4c180802d25858190802d258581a0802c64c4c1b0802c64c4c1c0802d258581d0802d258581e0802700a0a000902700a0a010902c64c4c020902c64c4c030902c64c4c040902c64c4c050902d25858060902d25858070902c64c4c080902c64c4c090902c64c4c0a0902c64c4c0b0902c64c4c0c0902c64c4c0d0902c64c4c0e0902c64c4c0f0902c64c4c100902c64c4c110902c64c4c120902c64c4c130902c64c4c140902d25858150902d25858160902c64c4c170902c64c4c180902c64c4c190902c64c4c1a0902c64c4c1b0902c64c4c1c0902c64c4c1d0902c64c4c1e0902700a0a000a02700a0a010a02c64c4c020a02c64c4c030a02c64c4c040a02c64c4c050a02c64c4c060a02c64c4c070a02d25858080a02d25858090a02c64c4c0a0a02b83e3e0b0a02b83e3e0c0a02c64c4c0d0a02c64c4c0e0a02c64c4c0f0a02d25858100a02c64c4c110a02c64c4c120a02c64c4c130a02c64c4c140a02c64c4c150a02c64c4c160a02d25858170a02d25858180a02c64c4c190a02b83e3e1a0a02b83e3e1b0a02c64c4c1c0a02c64c4c1d0a02c64c4c1e0a02700a0a000b02700a0a010b02c64c4c020b02c64c4c030b02d25858040b02d25858050b02c64c4c060b02d25858070b02d25858080b02d25858090b02c64c4c0a0b02b83e3e0b0b02c64c4c0c0b02d258580d0b02d258580e0b02c64c4c0f0b02d25858100b02c64c4c110b02c64c4c120b02d25858130b02d25858140b02c64c4c150b02d25858160b02d25858170b02d25858180b02c64c4c190b02b83e3e1a0b02c64c4c1b0b02d258581c0b02d258581d0b02c64c4c1e0b02700a0a000c02700a0a010c02c64c4c020c02d25858030c02d25858040c02d25858050c02c64c4c060c02d25858070c02d25858080c02c64c4c090c02c64c4c0a0c02c64c4c0b0c02c64c4c0c0c02d258580d0c02d258580e0c02d258580f0c02c64c4c100c02c64c4c110c02d25858120c02d25858130c02d25858140c02c64c4c150c02d25858160c02d25858170c02c64c4c180c02c64c4c190c02c64c4c1a0c02c64c4c1b0c02d258581c0c02d258581d0c02d258581e0c02700a0a000d02700a0a010d02c64c4c020d02d25858030d02d25858040d02c64c4c050d02c64c4c060d02c64c4c070d02c64c4c080d02c64c4c090d02c64c4c0a0d02c64c4c0b0d02c64c4c0c0d02c64c4c0d0d02d258580e0d02d258580f0d02c64c4c100d02c64c4c110d02d25858120d02d25858130d02c64c4c140d02c64c4c150d02c64c4c160d02c64c4c170d02c64c4c180d02c64c4c190d02c64c4c1a0d02c64c4c1b0d02c64c4c1c0d02d258581d0d02d258581e0d02700a0a000e02700a0a010e02c64c4c020e02d25858030e02d25858040e02c64c4c050e02b83e3e060e02c64c4c070e02d25858080e02d25858090e02d258580a0e02c64c4c0b0e02d258580c0e02d258580d0e02c64c4c0e0e02c64c4c0f0e02d25858100e02c64c4c110e02d25858120e02d25858130e02c64c4c140e02b83e3e150e02c64c4c160e02d25858170e02d25858180e02d25858190e02c64c4c1a0e02d258581b0e02d258581c0e02c64c4c1d0e02c64c4c1e0e02700a0a000f02700a0a010f02c64c4c020f02d25858030f02d25858040f02c64c4c050f02b83e3e060f02c64c4c070f02d25858080f02d25858090f02d258580a0f02c64c4c0b0f02d258580c0f02d258580d0f02c64c4c0e0f02c64c4c0f0f02d25858100f02c64c4c110f02d25858120f02d25858130f02c64c4c140f02b83e3e150f02c64c4c160f02d25858170f02d25858180f02d25858190f02c64c4c1a0f02d258581b0f02d258581c0f02c64c4c1d0f02c64c4c1e0f02700a0a001002700a0a011002d25858021002d25858031002d25858041002c64c4c051002c64c4c061002c64c4c071002d25858081002d25858091002c64c4c0a1002d258580b1002d258580c1002c64c4c0d1002c64c4c0e1002c64c4c0f1002c64c4c101002d25858111002d25858121002d25858131002c64c4c141002c64c4c151002d25858161002d25858171002d25858181002c64c4c191002c64c4c1a1002c64c4c1b1002c64c4c1c1002c64c4c1d1002c64c4c1e1002700a0a001102700a0a011102d25858021102d25858031102c64c4c041102c64c4c051102d25858061102d25858071102c64c4c081102c64c4c091102c64c4c0a1102c64c4c0b1102c64c4c0c1102d258580d1102d258580e1102d258580f1102b83e3e101102d25858111102c64c4c121102c64c4c131102d25858141102d25858151102d25858161102c64c4c171102c64c4c181102b83e3e191102c64c4c1a1102c64c4c1b1102d258581c1102d258581d1102d258581e1102700a0a001202700a0a011202c64c4c021202c64c4c031202c64c4c041202d25858051202d25858061202c64c4c071202c64c4c081202b83e3e091202d258580a1202d258580b1202c64c4c0c1202d258580d1202d258580e1202d258580f1202c64c4c101202c64c4c111202d25858121202c64c4c131202d25858141202d25858151202c64c4c161202c64c4c171202c64c4c181202d25858191202d258581a1202c64c4c1b1202d258581c1202d258581d1202d258581e1202700a0a001302700a0a011302d25858021302c64c4c031302c64c4c041302c64c4c051302c64c4c061302c64c4c071302c64c4c081302d25858091302d258580a1302d258580b1302d258580c1302c64c4c0d1302d258580e1302d258580f1302c64c4c101302d25858111302c64c4c121302c64c4c131302c64c4c141302c64c4c151302c64c4c161302d25858171302d25858181302c64c4c191302d258581a1302c64c4c1b1302c64c4c1c1302d258581d1302d258581e1302700a0a001402700a0a011402d25858021402d25858031402b83e3e041402c64c4c051402d25858061402d25858071402c64c4c081402d25858091402d258580a1402c64c4c0b1402c64c4c0c1402c64c4c0d1402b83e3e0e1402b83e3e0f1402d25858101402d25858111402d25858121402b83e3e131402c64c4c141402d25858151402d25858161402c64c4c171402d25858181402d25858191402c64c4c1a1402c64c4c1b1402c64c4c1c1402b83e3e1d1402b83e3e1e1402700a0a001502700a0a011502d25858021502c64c4c031502b83e3e041502b83e3e051502d25858061502d25858071502c64c4c081502c64c4c091502b83e3e0a1502c64c4c0b1502c64c4c0c1502c64c4c0d1502c64c4c0e1502b83e3e0f1502d25858101502d25858111502c64c4c121502b83e3e131502b83e3e141502d25858151502d25858161502c64c4c171502c64c4c181502b83e3e191502c64c4c1a1502c64c4c1b1502c64c4c1c1502c64c4c1d1502b83e3e1e1502700a0a001602700a0a011602700a0a021602c64c4c031602c64c4c041602c64c4c051602c64c4c061602c64c4c071602c64c4c081602c64c4c091602b83e3e0a1602b83e3e0b1602c64c4c0c1602d258580d1602d258580e1602c64c4c0f1602c64c4c101602c64c4c111602c64c4c121602c64c4c131602c64c4c141602c64c4c151602c64c4c161602c64c4c171602c64c4c181602b83e3e191602b83e3e1a1602c64c4c1b1602d258581c1602d258581d1602700a0a1e1602700a0a021702700a0a031702700a0a041702c64c4c051702c64c4c061702d25858071702d25858081702c64c4c091702d258580a1702d258580b1702c64c4c0c1702d258580d1702d258580e1702d258580f1702b83e3e101702b83e3e111702d25858121702d25858131702c64c4c141702c64c4c151702d25858161702d25858171702c64c4c181702d25858191702d258581a1702c64c4c1b1702700a0a1c1702700a0a041802700a0a051802700a0a061802d25858071802d25858081802c64c4c091802d258580a1802d258580b1802c64c4c0c1802c64c4c0d1802d258580e1802d258580f1802b83e3e101802c64c4c111802d25858121802d25858131802c64c4c141802d25858151802d25858161802d25858171802c64c4c181802d25858191802700a0a1a1802700a0a061902700a0a071902700a0a081902c64c4c091902c64c4c0a1902c64c4c0b1902c64c4c0c1902c64c4c0d1902c64c4c0e1902c64c4c0f1902c64c4c101902c64c4c111902c64c4c121902c64c4c131902c64c4c141902d25858151902d25858161902c64c4c171902700a0a181902700a0a081a02700a0a091a02700a0a0a1a02b83e3e0b1a02b83e3e0c1a02c64c4c0d1a02c64c4c0e1a02c64c4c0f1a02d25858101a02c64c4c111a02c64c4c121a02c64c4c131a02c64c4c141a02c64c4c151a02700a0a161a02700a0a0a1b02700a0a0b1b02700a0a0c1b02d258580d1b02d258580e1b02c64c4c0f1b02d25858101b02c64c4c111b02c64c4c121b02d25858131b02700a0a141b02700a0a0c1c02700a0a0d1c02700a0a0e1c02d258580f1c02c64c4c101c02c64c4c111c02700a0a121c02700a0a0e1d02700a0a0f1d02700a0a101d02700a0a");

    function Web$Kaelin$Entity$background$(_terrain$1) {
        var $449 = ({
            _: 'Web.Kaelin.Entity.background',
            'terrain': _terrain$1
        });
        return $449;
    };
    const Web$Kaelin$Entity$background = x0 => Web$Kaelin$Entity$background$(x0);
    const NatMap = null;
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);
    const F64$to_i32 = a0 => ((a0 >> 0));

    function Word$to_f64$(_a$2) {
        var Word$to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$to_f64 = _a$2 => Word$to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$to_f64 = x0 => Word$to_f64$(x0);
    const U32$to_f64 = a0 => (a0);

    function U32$to_i32$(_n$1) {
        var $450 = (((_n$1) >> 0));
        return $450;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

    function I32$abs$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $452 = i32_to_word(self);
                var $453 = I32$new$(Word$abs$($452));
                var $451 = $453;
                break;
        };
        return $451;
    };
    const I32$abs = x0 => I32$abs$(x0);
    const F64$to_u32 = a0 => ((a0 >>> 0));

    function Word$s_to_f64$(_a$2) {
        var Word$s_to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$s_to_f64 = _a$2 => Word$s_to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$s_to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$s_to_f64 = x0 => Word$s_to_f64$(x0);
    const I32$to_f64 = a0 => (a0);

    function I32$to_u32$(_n$1) {
        var $454 = (((_n$1) >>> 0));
        return $454;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $456 = Bool$true;
                var $455 = $456;
                break;
            case 'Cmp.gtn':
                var $457 = Bool$false;
                var $455 = $457;
                break;
        };
        return $455;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $458 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $458;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $460 = self.i;
                var $461 = self.j;
                var _i$5 = $460;
                var _j$6 = $461;
                var _sum$7 = ((_i$5 + _j$6) >> 0);
                var _abs$8 = I32$abs$(_sum$7);
                var _abs$9 = I32$to_u32$(_abs$8);
                var $462 = (_abs$9 <= _map_size$2);
                var $459 = $462;
                break;
        };
        return $459;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);
    const Web$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = Web$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _new_terrain$5 = Web$Kaelin$Terrain$grass$(Web$Kaelin$Assets$tile$dark_grass_4, Web$Kaelin$Assets$tile$hex_range, Web$Kaelin$Assets$tile$hex_hovered);
        var _new_terrain$6 = Web$Kaelin$Entity$background$(_new_terrain$5);
        var _map$7 = (() => {
            var $464 = _map$1;
            var $465 = 0;
            var $466 = _height$4;
            let _map$8 = $464;
            for (let _j$7 = $465; _j$7 < $466; ++_j$7) {
                var _map$9 = (() => {
                    var $467 = _map$8;
                    var $468 = 0;
                    var $469 = _width$3;
                    let _map$10 = $467;
                    for (let _i$9 = $468; _i$9 < $469; ++_i$9) {
                        var _coord_i$11 = ((U32$to_i32$(_i$9) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$12 = ((U32$to_i32$(_j$7) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$13 = Web$Kaelin$Coord$new$(_coord_i$11, _coord_j$12);
                        var _fit$14 = Web$Kaelin$Coord$fit$(_coord$13, _map_size$2);
                        var self = _fit$14;
                        if (self) {
                            var $470 = Web$Kaelin$Map$push$(_coord$13, _new_terrain$6, _map$10);
                            var $467 = $470;
                        } else {
                            var $471 = _map$10;
                            var $467 = $471;
                        };
                        _map$10 = $467;
                    };
                    return _map$10;
                })();
                var $464 = _map$9;
                _map$8 = $464;
            };
            return _map$8;
        })();
        var $463 = _map$7;
        return $463;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $472 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $472;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _cast_info$4, _map$5, _interface$6) {
        var $473 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'players': _players$3,
            'cast_info': _cast_info$4,
            'map': _map$5,
            'interface': _interface$6
        });
        return $473;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5);
    const Web$Kaelin$App$init = (() => {
        var _room$1 = Web$Kaelin$Constants$room;
        var _tick$2 = 0n;
        var _players$3 = Map$from_list$(List$nil);
        var _cast_info$4 = Maybe$none;
        var _map$5 = Web$Kaelin$Map$init$(Web$Kaelin$Map$arena);
        var _interface$6 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var $474 = Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _cast_info$4, _map$5, _interface$6);
        return $474;
    })();

    function DOM$text$(_value$1) {
        var $475 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $475;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $476 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $476;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $477 = self.head;
                        var $478 = self.tail;
                        var $479 = List$reverse$go$($478, List$cons$($477, _res$3));
                        return $479;
                    case 'List.nil':
                        var $480 = _res$3;
                        return $480;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $481 = List$reverse$go$(_xs$2, List$nil);
        return $481;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _r$2]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [_a$1, _r$2];
        while (true) {
            let [_a$1, _r$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $482 = self.slice(0, -1);
                        var $483 = Bits$reverse$tco$($482, (_r$2 + '0'));
                        return $483;
                    case 'i':
                        var $484 = self.slice(0, -1);
                        var $485 = Bits$reverse$tco$($484, (_r$2 + '1'));
                        return $485;
                    case 'e':
                        var $486 = _r$2;
                        return $486;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $487 = Bits$reverse$tco$(_a$1, Bits$e);
        return $487;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $489 = self.val;
                var $490 = self.lft;
                var $491 = self.rgt;
                var self = $489;
                switch (self._) {
                    case 'Maybe.some':
                        var $493 = self.value;
                        var $494 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $493), _list$4);
                        var _list0$8 = $494;
                        break;
                    case 'Maybe.none':
                        var $495 = _list$4;
                        var _list0$8 = $495;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($490, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($491, (_key$3 + '1'), _list1$9);
                var $492 = _list2$10;
                var $488 = $492;
                break;
            case 'BitsMap.new':
                var $496 = _list$4;
                var $488 = $496;
                break;
        };
        return $488;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $498 = self.head;
                var $499 = self.tail;
                var $500 = List$cons$(_f$4($498), List$mapped$($499, _f$4));
                var $497 = $500;
                break;
            case 'List.nil':
                var $501 = List$nil;
                var $497 = $501;
                break;
        };
        return $497;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $503 = self.slice(0, -1);
                var $504 = (2n * Bits$to_nat$($503));
                var $502 = $504;
                break;
            case 'i':
                var $505 = self.slice(0, -1);
                var $506 = Nat$succ$((2n * Bits$to_nat$($505)));
                var $502 = $506;
                break;
            case 'e':
                var $507 = 0n;
                var $502 = $507;
                break;
        };
        return $502;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $508 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $510 = self.fst;
                    var $511 = self.snd;
                    var $512 = Pair$new$(Bits$to_nat$($510), $511);
                    var $509 = $512;
                    break;
            };
            return $509;
        }));
        return $508;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $514 = self.fst;
                var $515 = $514;
                var $513 = $515;
                break;
        };
        return $513;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Either$(_A$1, _B$2) {
        var $516 = null;
        return $516;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $517 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $517;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $518 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $518;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $519 = Either$left$(_n$1);
                    return $519;
                } else {
                    var $520 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $522 = Either$right$(Nat$succ$($520));
                        var $521 = $522;
                    } else {
                        var $523 = (self - 1n);
                        var $524 = Nat$sub_rem$($523, $520);
                        var $521 = $524;
                    };
                    return $521;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $525 = self.value;
                        var $526 = Nat$div_mod$go$($525, _m$2, Nat$succ$(_d$3));
                        return $526;
                    case 'Either.right':
                        var $527 = Pair$new$(_d$3, _n$1);
                        return $527;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));
    const Nat$div = a0 => a1 => (a0 / a1);
    const Int$add = a0 => a1 => (a0 + a1);
    const Int$sub = a0 => a1 => (a0 - a1);

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $528 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $528;
                } else {
                    var $529 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $531 = _r$3;
                        var $530 = $531;
                    } else {
                        var $532 = (self - 1n);
                        var $533 = Nat$mod$go$($532, $529, Nat$succ$(_r$3));
                        var $530 = $533;
                    };
                    return $530;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);

    function Web$Kaelin$Coord$Convert$nat_to_axial$(_a$1) {
        var _coord_i$2 = (_a$1 / 10000n);
        var _coord_i$3 = Int$from_nat$(_coord_i$2);
        var _coord_i$4 = (_coord_i$3 - Int$from_nat$(1000n));
        var _coord_j$5 = (_a$1 % 10000n);
        var _coord_j$6 = Int$from_nat$(_coord_j$5);
        var _coord_j$7 = (_coord_j$6 - Int$from_nat$(1000n));
        var _coord_i$8 = Int$to_i32$(_coord_i$4);
        var _coord_j$9 = Int$to_i32$(_coord_j$7);
        var $534 = Web$Kaelin$Coord$new$(_coord_i$8, _coord_j$9);
        return $534;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $536 = self.i;
                var $537 = self.j;
                var _i$4 = $536;
                var _j$5 = $537;
                var _int_rad$6 = U32$to_i32$(Web$Kaelin$Constants$hexagon_radius);
                var _hlf$7 = ((_int_rad$6 / Int$to_i32$(Int$from_nat$(2n))) >> 0);
                var _int_screen_center_x$8 = U32$to_i32$(Web$Kaelin$Constants$center_x);
                var _int_screen_center_y$9 = U32$to_i32$(Web$Kaelin$Constants$center_y);
                var _cx$10 = ((_int_screen_center_x$8 + ((_j$5 * _int_rad$6) >> 0)) >> 0);
                var _cx$11 = ((_cx$10 + ((_i$4 * ((_int_rad$6 * Int$to_i32$(Int$from_nat$(2n))) >> 0)) >> 0)) >> 0);
                var _cy$12 = ((_int_screen_center_y$9 + ((_j$5 * ((_hlf$7 * Int$to_i32$(Int$from_nat$(3n))) >> 0)) >> 0)) >> 0);
                var _cx$13 = I32$to_u32$(_cx$11);
                var _cy$14 = I32$to_u32$(_cy$12);
                var $538 = Pair$new$(_cx$13, _cy$14);
                var $535 = $538;
                break;
        };
        return $535;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $540 = self.length;
                var $541 = $540;
                var $539 = $541;
                break;
        };
        return $539;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $542 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $544 = self.fst;
                    var $545 = _rec$6($544);
                    var $543 = $545;
                    break;
            };
            return $543;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $547 = self.snd;
                    var $548 = _rec$6($547);
                    var $546 = $548;
                    break;
            };
            return $546;
        }), _idx$3)(_arr$4);
        return $542;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $550 = self.pred;
                var $551 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $553 = self.pred;
                            var $554 = (_a$pred$9 => {
                                var $555 = Word$o$(Word$and$(_a$pred$9, $553));
                                return $555;
                            });
                            var $552 = $554;
                            break;
                        case 'Word.i':
                            var $556 = self.pred;
                            var $557 = (_a$pred$9 => {
                                var $558 = Word$o$(Word$and$(_a$pred$9, $556));
                                return $558;
                            });
                            var $552 = $557;
                            break;
                        case 'Word.e':
                            var $559 = (_a$pred$7 => {
                                var $560 = Word$e;
                                return $560;
                            });
                            var $552 = $559;
                            break;
                    };
                    var $552 = $552($550);
                    return $552;
                });
                var $549 = $551;
                break;
            case 'Word.i':
                var $561 = self.pred;
                var $562 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $564 = self.pred;
                            var $565 = (_a$pred$9 => {
                                var $566 = Word$o$(Word$and$(_a$pred$9, $564));
                                return $566;
                            });
                            var $563 = $565;
                            break;
                        case 'Word.i':
                            var $567 = self.pred;
                            var $568 = (_a$pred$9 => {
                                var $569 = Word$i$(Word$and$(_a$pred$9, $567));
                                return $569;
                            });
                            var $563 = $568;
                            break;
                        case 'Word.e':
                            var $570 = (_a$pred$7 => {
                                var $571 = Word$e;
                                return $571;
                            });
                            var $563 = $570;
                            break;
                    };
                    var $563 = $563($561);
                    return $563;
                });
                var $549 = $562;
                break;
            case 'Word.e':
                var $572 = (_b$4 => {
                    var $573 = Word$e;
                    return $573;
                });
                var $549 = $572;
                break;
        };
        var $549 = $549(_b$3);
        return $549;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $575 = _img$5;
            var $576 = 0;
            var $577 = _len$6;
            let _img$8 = $575;
            for (let _i$7 = $576; _i$7 < $577; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $575 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $575;
            };
            return _img$8;
        })();
        var $574 = _img$7;
        return $574;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$background$(_map$1, _img$2) {
        var _list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $580 = _img$2;
            var $581 = _list$3;
            let _img$5 = $580;
            let _pair$4;
            while ($581._ === 'List.cons') {
                _pair$4 = $581.head;
                var self = _pair$4;
                switch (self._) {
                    case 'Pair.new':
                        var $582 = self.fst;
                        var $583 = self.snd;
                        var _coord$8 = Web$Kaelin$Coord$Convert$nat_to_axial$($582);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$8);
                        switch (self._) {
                            case 'Pair.new':
                                var $585 = self.fst;
                                var $586 = self.snd;
                                var _i$11 = (($585 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                var _j$12 = (($586 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                var _img$13 = (() => {
                                    var $589 = _img$5;
                                    var $590 = $583;
                                    let _img$14 = $589;
                                    let _entity$13;
                                    while ($590._ === 'List.cons') {
                                        _entity$13 = $590.head;
                                        var self = _entity$13;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.background':
                                                var $591 = self.terrain;
                                                var self = $591;
                                                switch (self._) {
                                                    case 'Web.Kaelin.Terrain.grass':
                                                        var $593 = self.normal;
                                                        var $594 = VoxBox$Draw$image$(_i$11, _j$12, 0, $593, _img$14);
                                                        var $592 = $594;
                                                        break;
                                                };
                                                var $589 = $592;
                                                break;
                                            case 'Web.Kaelin.Entity.creature':
                                                var $595 = _img$14;
                                                var $589 = $595;
                                                break;
                                        };
                                        _img$14 = $589;
                                        $590 = $590.tail;
                                    }
                                    return _img$14;
                                })();
                                var $587 = _img$13;
                                var $584 = $587;
                                break;
                        };
                        var $580 = $584;
                        break;
                };
                _img$5 = $580;
                $581 = $581.tail;
            }
            return _img$5;
        })();
        var $578 = _img$4;
        return $578;
    };
    const Web$Kaelin$Draw$state$background = x0 => x1 => Web$Kaelin$Draw$state$background$(x0, x1);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $596 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $596;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $598 = self.i;
                var $599 = self.j;
                var _x$4 = $598;
                var _z$5 = $599;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $600 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $597 = $600;
                break;
        };
        return $597;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $602 = self.head;
                var $603 = self.tail;
                var $604 = List$cons$(_f$3($602), List$map$(_f$3, $603));
                var $601 = $604;
                break;
            case 'List.nil':
                var $605 = List$nil;
                var $601 = $605;
                break;
        };
        return $601;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $607 = self.x;
                var $608 = self.z;
                var _i$5 = $607;
                var _j$6 = $608;
                var $609 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $606 = $609;
                break;
        };
        return $606;
    };
    const Web$Kaelin$Coord$Convert$cubic_to_axial = x0 => Web$Kaelin$Coord$Convert$cubic_to_axial$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $611 = Bool$false;
                var $610 = $611;
                break;
            case 'Cmp.gtn':
                var $612 = Bool$true;
                var $610 = $612;
                break;
        };
        return $610;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $614 = Cmp$gtn;
                var $613 = $614;
                break;
            case 'Cmp.eql':
                var $615 = Cmp$eql;
                var $613 = $615;
                break;
            case 'Cmp.gtn':
                var $616 = Cmp$ltn;
                var $613 = $616;
                break;
        };
        return $613;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $619 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $618 = $619;
            } else {
                var $620 = Bool$false;
                var $618 = $620;
            };
            var $617 = $618;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $622 = Bool$true;
                var $621 = $622;
            } else {
                var $623 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $621 = $623;
            };
            var $617 = $621;
        };
        return $617;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $625 = _a$1;
            var $624 = $625;
        } else {
            var $626 = _b$2;
            var $624 = $626;
        };
        return $624;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $628 = Bool$true;
                var $627 = $628;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $629 = Bool$false;
                var $627 = $629;
                break;
        };
        return $627;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $632 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $631 = $632;
            } else {
                var $633 = Bool$true;
                var $631 = $633;
            };
            var $630 = $631;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $635 = Bool$false;
                var $634 = $635;
            } else {
                var $636 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $634 = $636;
            };
            var $630 = $634;
        };
        return $630;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $638 = _a$1;
            var $637 = $638;
        } else {
            var $639 = _b$2;
            var $637 = $639;
        };
        return $637;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $641 = self.x;
                var $642 = self.y;
                var $643 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $645 = self.x;
                        var $646 = self.y;
                        var $647 = self.z;
                        var _x$9 = (($641 + $645) >> 0);
                        var _y$10 = (($642 + $646) >> 0);
                        var _z$11 = (($643 + $647) >> 0);
                        var $648 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $644 = $648;
                        break;
                };
                var $640 = $644;
                break;
        };
        return $640;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $650 = self.head;
                var $651 = self.tail;
                var $652 = List$cons$($650, List$concat$($651, _bs$3));
                var $649 = $652;
                break;
            case 'List.nil':
                var $653 = _bs$3;
                var $649 = $653;
                break;
        };
        return $649;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = (Number(_distance$2) >>> 0);
        var _distance_i32$4 = U32$to_i32$(_distance_32$3);
        var _double_distance$5 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$6 = List$nil;
        var _result$7 = (() => {
            var $655 = _result$6;
            var $656 = 0;
            var $657 = _double_distance$5;
            let _result$8 = $655;
            for (let _j$7 = $656; _j$7 < $657; ++_j$7) {
                var _negative_distance$9 = ((-_distance_i32$4));
                var _positive_distance$10 = _distance_i32$4;
                var _x$11 = ((U32$to_i32$(_j$7) - _positive_distance$10) >> 0);
                var _max$12 = I32$max$(_negative_distance$9, ((((-_x$11)) + _negative_distance$9) >> 0));
                var _min$13 = I32$min$(_positive_distance$10, ((((-_x$11)) + _positive_distance$10) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $658 = _result$8;
                    var $659 = 0;
                    var $660 = _distance_between_max_min$14;
                    let _result$16 = $658;
                    for (let _i$15 = $659; _i$15 < $660; ++_i$15) {
                        var _y$17 = ((U32$to_i32$(_i$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var _result$20 = List$concat$(_result$16, List$cons$(_new_coord$19, List$nil));
                        var $658 = _result$20;
                        _result$16 = $658;
                    };
                    return _result$16;
                })();
                var $655 = _result$15;
                _result$8 = $655;
            };
            return _result$8;
        })();
        var $654 = _result$7;
        return $654;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $661 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $661;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function Web$Kaelin$Draw$terrain$(_coord$1, _tile$2, _img$3, _cast_info$4) {
        var _img$5 = (() => {
            var $664 = _img$3;
            var $665 = _tile$2;
            let _img$6 = $664;
            let _entity$5;
            while ($665._ === 'List.cons') {
                _entity$5 = $665.head;
                var self = _entity$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $666 = self.terrain;
                        var self = $666;
                        switch (self._) {
                            case 'Web.Kaelin.Terrain.grass':
                                var $668 = self.ability;
                                var $669 = self.movement;
                                var self = _cast_info$4;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $671 = self.hex_effect;
                                        var self = $671;
                                        switch (self._) {
                                            case 'Web.Kaelin.HexEffect.movement':
                                                var $673 = $669;
                                                var $672 = $673;
                                                break;
                                            case 'Web.Kaelin.HexEffect.ability':
                                                var $674 = $668;
                                                var $672 = $674;
                                                break;
                                        };
                                        var $670 = $672;
                                        break;
                                };
                                var $667 = $670;
                                break;
                        };
                        var $664 = $667;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $675 = _img$6;
                        var $664 = $675;
                        break;
                };
                _img$6 = $664;
                $665 = $665.tail;
            }
            return _img$6;
        })();
        var $662 = _img$5;
        return $662;
    };
    const Web$Kaelin$Draw$terrain = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$terrain$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$state$range_cast$(_map$1, _cast_info$2, _img$3) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Maybe.some':
                var $677 = self.value;
                var self = $677;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $679 = self.hero_pos;
                        var $680 = self.range;
                        var _range$9 = Web$Kaelin$Coord$Axial$range$($679, $680);
                        var _img$10 = (() => {
                            var $683 = _img$3;
                            var $684 = _range$9;
                            let _img$11 = $683;
                            let _coord_range$10;
                            while ($684._ === 'List.cons') {
                                _coord_range$10 = $684.head;
                                var _tile$12 = Web$Kaelin$Map$get$(_coord_range$10, _map$1);
                                var _terrain$13 = Web$Kaelin$Draw$terrain$(_coord_range$10, Maybe$default$(_tile$12, List$nil), _img$11, $677);
                                var self = Web$Kaelin$Coord$to_screen_xy$(_coord_range$10);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $685 = self.fst;
                                        var $686 = self.snd;
                                        var _i$16 = (($685 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                        var _j$17 = (($686 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                        var $687 = VoxBox$Draw$image$(_i$16, _j$17, 0, _terrain$13, _img$11);
                                        var $683 = $687;
                                        break;
                                };
                                _img$11 = $683;
                                $684 = $684.tail;
                            }
                            return _img$11;
                        })();
                        var $681 = _img$10;
                        var $678 = $681;
                        break;
                };
                var $676 = $678;
                break;
            case 'Maybe.none':
                var $688 = _img$3;
                var $676 = $688;
                break;
        };
        return $676;
    };
    const Web$Kaelin$Draw$state$range_cast = x0 => x1 => x2 => Web$Kaelin$Draw$state$range_cast$(x0, x1, x2);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $690 = self.img;
                var _aux_y$8 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$9 = ((_cy$2 - _aux_y$8) >>> 0);
                var _cx$10 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $691 = VoxBox$Draw$image$(_cx$10, _cy$9, 0, $690, _img$5);
                var $689 = $691;
                break;
        };
        return $689;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$players$(_map$1, _img$2) {
        var _player_list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $694 = _img$2;
            var $695 = _player_list$3;
            let _img$5 = $694;
            let _prs$4;
            while ($695._ === 'List.cons') {
                _prs$4 = $695.head;
                var self = _prs$4;
                switch (self._) {
                    case 'Pair.new':
                        var $696 = self.fst;
                        var $697 = self.snd;
                        var _coord$8 = Web$Kaelin$Coord$Convert$nat_to_axial$($696);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$8);
                        switch (self._) {
                            case 'Pair.new':
                                var $699 = self.fst;
                                var $700 = self.snd;
                                var _img$11 = (() => {
                                    var $703 = _img$5;
                                    var $704 = $697;
                                    let _img$12 = $703;
                                    let _entity$11;
                                    while ($704._ === 'List.cons') {
                                        _entity$11 = $704.head;
                                        var self = _entity$11;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.creature':
                                                var $705 = self.hero;
                                                var $706 = Web$Kaelin$Draw$hero$($699, $700, 0, $705, _img$12);
                                                var $703 = $706;
                                                break;
                                            case 'Web.Kaelin.Entity.background':
                                                var $707 = _img$12;
                                                var $703 = $707;
                                                break;
                                        };
                                        _img$12 = $703;
                                        $704 = $704.tail;
                                    }
                                    return _img$12;
                                })();
                                var $701 = _img$11;
                                var $698 = $701;
                                break;
                        };
                        var $694 = $698;
                        break;
                };
                _img$5 = $694;
                $695 = $695.tail;
            }
            return _img$5;
        })();
        var $692 = _img$4;
        return $692;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $709 = self.cast_info;
                var $710 = self.map;
                var _img$9 = Web$Kaelin$Draw$state$background$($710, _img$1);
                var _img$10 = Web$Kaelin$Draw$state$range_cast$($710, $709, _img$9);
                var _img$11 = Web$Kaelin$Draw$state$players$($710, _img$10);
                var $711 = _img$11;
                var $708 = $711;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $712 = _img$1;
                var $708 = $712;
                break;
        };
        return $708;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $714 = DOM$text$("TODO: create the renderer for this game state mode");
                var $713 = $714;
                break;
            case 'Web.Kaelin.State.game':
                var $715 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $713 = $715;
                break;
        };
        return $713;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $716 = null;
        return $716;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $717 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $717;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $719 = self.value;
                var $720 = _f$4($719);
                var $718 = $720;
                break;
            case 'IO.ask':
                var $721 = self.query;
                var $722 = self.param;
                var $723 = self.then;
                var $724 = IO$ask$($721, $722, (_x$8 => {
                    var $725 = IO$bind$($723(_x$8), _f$4);
                    return $725;
                }));
                var $718 = $724;
                break;
        };
        return $718;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $726 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $726;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $727 = _new$2(IO$bind)(IO$end);
        return $727;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $728 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $728;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $729 = _m$pure$2;
        return $729;
    }))(Dynamic$new$(Unit$new));

    function IO$do$(_call$1, _param$2) {
        var $730 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $731 = IO$end$(Unit$new);
            return $731;
        }));
        return $730;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $732 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $733 = _m$bind$3;
            return $733;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $734 = App$pass;
            return $734;
        }));
        return $732;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $735 = App$do$("watch", _room$1);
        return $735;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $736 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $737 = _m$pure$4;
            return $737;
        }))(Dynamic$new$(_value$2));
        return $736;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kaelin$Action$update_interface$(_interface$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $739 = self.room;
                var $740 = self.tick;
                var $741 = self.players;
                var $742 = self.cast_info;
                var $743 = self.map;
                var $744 = Web$Kaelin$State$game$($739, $740, $741, $742, $743, _interface$1);
                var $738 = $744;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $745 = _state$2;
                var $738 = $745;
                break;
        };
        return $738;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => Web$Kaelin$Action$update_interface$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$new$(_value$1) {
        var $746 = word_to_u16(_value$1);
        return $746;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function String$cons$(_head$1, _tail$2) {
        var $747 = (String.fromCharCode(_head$1) + _tail$2);
        return $747;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$post$(_room$1, _data$2) {
        var $748 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $748;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const String$nil = '';

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $750 = String$nil;
            var $749 = $750;
        } else {
            var $751 = (self - 1n);
            var $752 = (_xs$1 + String$repeat$(_xs$1, $751));
            var $749 = $752;
        };
        return $749;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $753 = _xs$2;
                    return $753;
                } else {
                    var $754 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $756 = String$nil;
                        var $755 = $756;
                    } else {
                        var $757 = self.charCodeAt(0);
                        var $758 = self.slice(1);
                        var $759 = String$drop$($754, $758);
                        var $755 = $759;
                    };
                    return $755;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function Web$Kaelin$Command$create_player$(_hero_id$1) {
        var $760 = ("0x1" + (String$repeat$("0", 55n) + String$drop$(2n, _hero_id$1)));
        return $760;
    };
    const Web$Kaelin$Command$create_player = x0 => Web$Kaelin$Command$create_player$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $761 = (_a$1 === _b$2);
        return $761;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $762 = Bool$true;
                    return $762;
                } else {
                    var $763 = self.charCodeAt(0);
                    var $764 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $766 = Bool$false;
                        var $765 = $766;
                    } else {
                        var $767 = self.charCodeAt(0);
                        var $768 = self.slice(1);
                        var self = Char$eql$($763, $767);
                        if (self) {
                            var $770 = String$starts_with$($768, $764);
                            var $769 = $770;
                        } else {
                            var $771 = Bool$false;
                            var $769 = $771;
                        };
                        var $765 = $769;
                    };
                    return $765;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $772 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $772;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $774 = self.head;
                var $775 = self.tail;
                var $776 = _cons$5($774)(List$fold$($775, _nil$4, _cons$5));
                var $773 = $776;
                break;
            case 'List.nil':
                var $777 = _nil$4;
                var $773 = $777;
                break;
        };
        return $773;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $778 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $778;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const Web$Kaelin$Resources$heroes = (() => {
        var _heroes$1 = List$cons$(Web$Kaelin$Hero$croni, List$cons$(Web$Kaelin$Hero$cyclope, List$cons$(Web$Kaelin$Hero$lela, List$cons$(Web$Kaelin$Hero$octoking, List$nil))));
        var $779 = List$fold$(_heroes$1, Map$from_list$(List$nil), (_hero$2 => _map$3 => {
            var self = _hero$2;
            switch (self._) {
                case 'Web.Kaelin.Hero.new':
                    var $781 = self.id;
                    var $782 = Map$set$($781, _hero$2, _map$3);
                    var $780 = $782;
                    break;
            };
            return $780;
        }));
        return $779;
    })();

    function Web$Kaelin$Player$new$(_addr$1, _team$2) {
        var $783 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1,
            'team': _team$2
        });
        return $783;
    };
    const Web$Kaelin$Player$new = x0 => x1 => Web$Kaelin$Player$new$(x0, x1);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n)));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $785 = self.room;
                var $786 = self.tick;
                var $787 = self.players;
                var $788 = self.cast_info;
                var $789 = self.map;
                var $790 = self.interface;
                var self = Map$get$(_key$4, $787);
                switch (self._) {
                    case 'Maybe.none':
                        var _creature$12 = Web$Kaelin$Entity$creature;
                        var _new_player$13 = Web$Kaelin$Player$new$(_user$1, "blue");
                        var _map$14 = Web$Kaelin$Map$push$(_init_pos$5, _creature$12(Maybe$some$(_user$1))(_hero$2), $789);
                        var _new_players$15 = Map$set$(_key$4, _new_player$13, $787);
                        var $792 = Web$Kaelin$State$game$($785, $786, _new_players$15, $788, _map$14, $790);
                        var $791 = $792;
                        break;
                    case 'Maybe.some':
                        var $793 = _state$3;
                        var $791 = $793;
                        break;
                };
                var $784 = $791;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $794 = _state$3;
                var $784 = $794;
                break;
        };
        return $784;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $796 = String$nil;
            var $795 = $796;
        } else {
            var $797 = self.charCodeAt(0);
            var $798 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $800 = String$nil;
                var $799 = $800;
            } else {
                var $801 = (self - 1n);
                var $802 = String$cons$($797, String$take$($801, $798));
                var $799 = $802;
            };
            var $795 = $799;
        };
        return $795;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function String$slice$(_i$1, _j$2, _xs$3) {
        var $803 = String$take$((_j$2 - _i$1 <= 0n ? 0n : _j$2 - _i$1), String$drop$(_i$1, _xs$3));
        return $803;
    };
    const String$slice = x0 => x1 => x2 => String$slice$(x0, x1, x2);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _result$3 = List$nil;
        var _players$4 = List$nil;
        var _result$5 = (() => {
            var $806 = _result$3;
            var $807 = _lmap$2;
            let _result$6 = $806;
            let _pair$5;
            while ($807._ === 'List.cons') {
                _pair$5 = $807.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $808 = self.fst;
                        var $809 = self.snd;
                        var _coord$9 = $808;
                        var _tile$10 = $809;
                        var _players$11 = (() => {
                            var $812 = _players$4;
                            var $813 = _tile$10;
                            let _players$12 = $812;
                            let _entity$11;
                            while ($813._ === 'List.cons') {
                                _entity$11 = $813.head;
                                var self = _entity$11;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.creature':
                                        var $814 = self.player;
                                        var self = $814;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $816 = self.value;
                                                var _axial_coord$16 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$9);
                                                var $817 = List$cons$(Pair$new$($816, _axial_coord$16), List$nil);
                                                var $815 = $817;
                                                break;
                                            case 'Maybe.none':
                                                var $818 = _players$12;
                                                var $815 = $818;
                                                break;
                                        };
                                        var $812 = $815;
                                        break;
                                    case 'Web.Kaelin.Entity.background':
                                        var $819 = _players$12;
                                        var $812 = $819;
                                        break;
                                };
                                _players$12 = $812;
                                $813 = $813.tail;
                            }
                            return _players$12;
                        })();
                        var $810 = List$concat$(_result$6, _players$11);
                        var $806 = $810;
                        break;
                };
                _result$6 = $806;
                $807 = $807.tail;
            }
            return _result$6;
        })();
        var $804 = Map$from_list$(_result$5);
        return $804;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$id_coord$(_addr$1, _map$2) {
        var _list$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $820 = Map$get$(_addr$1, _list$3);
        return $820;
    };
    const Web$Kaelin$Map$id_coord = x0 => x1 => Web$Kaelin$Map$id_coord$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _tile$3 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$2), List$nil);
        var _is_occupied$4 = Bool$false;
        var _is_occupied$5 = (() => {
            var $823 = _is_occupied$4;
            var $824 = _tile$3;
            let _is_occupied$6 = $823;
            let _ent$5;
            while ($824._ === 'List.cons') {
                _ent$5 = $824.head;
                var self = _ent$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $825 = (_is_occupied$6 || Bool$false);
                        var $823 = $825;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $826 = Bool$true;
                        var $823 = $826;
                        break;
                };
                _is_occupied$6 = $823;
                $824 = $824.tail;
            }
            return _is_occupied$6;
        })();
        var $821 = _is_occupied$5;
        return $821;
    };
    const Web$Kaelin$Map$is_occupied = x0 => x1 => Web$Kaelin$Map$is_occupied$(x0, x1);

    function List$pop_at$go$(_idx$2, _list$3, _searched_list$4) {
        var List$pop_at$go$ = (_idx$2, _list$3, _searched_list$4) => ({
            ctr: 'TCO',
            arg: [_idx$2, _list$3, _searched_list$4]
        });
        var List$pop_at$go = _idx$2 => _list$3 => _searched_list$4 => List$pop_at$go$(_idx$2, _list$3, _searched_list$4);
        var arg = [_idx$2, _list$3, _searched_list$4];
        while (true) {
            let [_idx$2, _list$3, _searched_list$4] = arg;
            var R = (() => {
                var self = _idx$2;
                if (self === 0n) {
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $828 = self.head;
                            var $829 = self.tail;
                            var $830 = Pair$new$(Maybe$some$($828), List$concat$(_searched_list$4, $829));
                            var $827 = $830;
                            break;
                        case 'List.nil':
                            var $831 = Pair$new$(Maybe$none, _searched_list$4);
                            var $827 = $831;
                            break;
                    };
                    return $827;
                } else {
                    var $832 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $834 = self.head;
                            var $835 = self.tail;
                            var $836 = List$pop_at$go$($832, $835, List$concat$(_searched_list$4, List$cons$($834, List$nil)));
                            var $833 = $836;
                            break;
                        case 'List.nil':
                            var $837 = Pair$new$(Maybe$none, _searched_list$4);
                            var $833 = $837;
                            break;
                    };
                    return $833;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $838 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $838;
    };
    const List$pop_at = x0 => x1 => List$pop_at$(x0, x1);

    function Web$Kaelin$Map$pop_at$(_idx$1, _coord$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$2, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $840 = self.value;
                var self = List$pop_at$(_idx$1, $840);
                switch (self._) {
                    case 'Pair.new':
                        var $842 = self.fst;
                        var $843 = self.snd;
                        var _map$8 = Web$Kaelin$Map$set$(_coord$2, $843, _map$3);
                        var $844 = Pair$new$(_map$8, $842);
                        var $841 = $844;
                        break;
                };
                var $839 = $841;
                break;
            case 'Maybe.none':
                var $845 = Pair$new$(_map$3, Maybe$none);
                var $839 = $845;
                break;
        };
        return $839;
    };
    const Web$Kaelin$Map$pop_at = x0 => x1 => x2 => Web$Kaelin$Map$pop_at$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_idx$1, _ca$2, _cb$3, _map$4) {
        var self = Web$Kaelin$Map$pop_at$(_idx$1, _ca$2, _map$4);
        switch (self._) {
            case 'Pair.new':
                var $847 = self.fst;
                var $848 = self.snd;
                var self = $848;
                switch (self._) {
                    case 'Maybe.some':
                        var $850 = self.value;
                        var $851 = Web$Kaelin$Map$push$(_cb$3, $850, $847);
                        var $849 = $851;
                        break;
                    case 'Maybe.none':
                        var $852 = _map$4;
                        var $849 = $852;
                        break;
                };
                var $846 = $849;
                break;
        };
        return $846;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => x3 => Web$Kaelin$Map$swap$(x0, x1, x2, x3);

    function Web$Kaelin$Player$move$(_coord_b$1, _state$2, _address$3) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $854 = self.room;
                var $855 = self.tick;
                var $856 = self.players;
                var $857 = self.cast_info;
                var $858 = self.map;
                var $859 = self.interface;
                var _coord_a$10 = Web$Kaelin$Map$id_coord$(_address$3, $858);
                var _is_occupied$11 = Web$Kaelin$Map$is_occupied$(_coord_b$1, $858);
                var _tile_b$12 = Web$Kaelin$Map$get$(_coord_b$1, $858);
                var self = _tile_b$12;
                switch (self._) {
                    case 'Maybe.none':
                        var $861 = _state$2;
                        var $860 = $861;
                        break;
                    case 'Maybe.some':
                        var self = _is_occupied$11;
                        if (self) {
                            var $863 = _state$2;
                            var $862 = $863;
                        } else {
                            var _new_map$14 = Web$Kaelin$Map$swap$(0n, Maybe$default$(_coord_a$10, _coord_b$1), _coord_b$1, $858);
                            var $864 = Web$Kaelin$State$game$($854, $855, $856, $857, _new_map$14, $859);
                            var $862 = $864;
                        };
                        var $860 = $862;
                        break;
                };
                var $853 = $860;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $865 = _state$2;
                var $853 = $865;
                break;
        };
        return $853;
    };
    const Web$Kaelin$Player$move = x0 => x1 => x2 => Web$Kaelin$Player$move$(x0, x1, x2);

    function Web$Kaelin$Player$move_by$(_i$1, _j$2, _state$3, _addr$4) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $867 = self.map;
                var _coord_a$11 = Web$Kaelin$Map$id_coord$(_addr$4, $867);
                var self = _coord_a$11;
                switch (self._) {
                    case 'Maybe.some':
                        var $869 = self.value;
                        var _coord$13 = $869;
                        var self = _coord$13;
                        switch (self._) {
                            case 'Web.Kaelin.Coord.new':
                                var $871 = self.i;
                                var $872 = self.j;
                                var _coord_b$16 = Web$Kaelin$Coord$new$((($871 + _i$1) >> 0), (($872 + _j$2) >> 0));
                                var $873 = Web$Kaelin$Player$move$(_coord_b$16, _state$3, _addr$4);
                                var $870 = $873;
                                break;
                        };
                        var $868 = $870;
                        break;
                    case 'Maybe.none':
                        var $874 = _state$3;
                        var $868 = $874;
                        break;
                };
                var $866 = $868;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $875 = _state$3;
                var $866 = $875;
                break;
        };
        return $866;
    };
    const Web$Kaelin$Player$move_by = x0 => x1 => x2 => x3 => Web$Kaelin$Player$move_by$(x0, x1, x2, x3);
    const Web$Kaelin$HexEffect$ability = ({
        _: 'Web.Kaelin.HexEffect.ability'
    });
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const F64$sub = a0 => a1 => (a0 - a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$add = a0 => a1 => (a0 + a1);

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $876 = (((_n$1 >> 0)));
        return $876;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (parseFloat("0.5"));
        var _big_number$3 = (parseFloat("1000.0"));
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $877 = (_result$5 - _big_number$3);
        return $877;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $878 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $878;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $880 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $882 = f64_to_word(self);
                        var $883 = Word$gtn$($880, $882);
                        var $881 = $883;
                        break;
                };
                var $879 = $881;
                break;
        };
        return $879;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (parseFloat("1000.0"));
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $885 = (_x$4 - _y$5);
            var $884 = $885;
        } else {
            var $886 = (_y$5 - _x$4);
            var $884 = $886;
        };
        return $884;
    };
    const Web$Kaelin$Coord$round$diff = x0 => x1 => Web$Kaelin$Coord$round$diff$(x0, x1);

    function Web$Kaelin$Coord$round$(_axial_x$1, _axial_y$2) {
        var _f$3 = U32$to_f64;
        var _i$4 = F64$to_i32;
        var _axial_z$5 = ((_f$3(0) - _axial_x$1) - _axial_y$2);
        var _round_x$6 = Web$Kaelin$Coord$round$round_F64$(_axial_x$1);
        var _round_y$7 = Web$Kaelin$Coord$round$round_F64$(_axial_y$2);
        var _round_z$8 = Web$Kaelin$Coord$round$round_F64$(_axial_z$5);
        var _diff_x$9 = Web$Kaelin$Coord$round$diff$(_axial_x$1, _round_x$6);
        var _diff_y$10 = Web$Kaelin$Coord$round$diff$(_axial_y$2, _round_y$7);
        var _diff_z$11 = Web$Kaelin$Coord$round$diff$(_axial_z$5, _round_z$8);
        var self = F64$gtn$(_diff_x$9, _diff_z$11);
        if (self) {
            var self = F64$gtn$(_diff_y$10, _diff_x$9);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $889 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $888 = $889;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $890 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $888 = $890;
            };
            var _result$12 = $888;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $892 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $891 = $892;
            } else {
                var $893 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $891 = $893;
            };
            var _result$12 = $891;
        };
        var $887 = _result$12;
        return $887;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $895 = self.fst;
                var $896 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (parseFloat("2.0")));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($895) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($896) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (parseFloat("0.25"));
                var _sixth$12 = ((parseFloat("1.0")) / (parseFloat("6.0")));
                var _third$13 = ((parseFloat("1.0")) / (parseFloat("3.0")));
                var _half$14 = (parseFloat("0.5"));
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $898 = self.fst;
                        var $899 = self.snd;
                        var $900 = Web$Kaelin$Coord$new$($898, $899);
                        var $897 = $900;
                        break;
                };
                var $894 = $897;
                break;
        };
        return $894;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

    function Web$Kaelin$CastInfo$new$(_mouse_pos$1, _hero_pos$2, _range$3, _hex_effect$4) {
        var $901 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'mouse_pos': _mouse_pos$1,
            'hero_pos': _hero_pos$2,
            'range': _range$3,
            'hex_effect': _hex_effect$4
        });
        return $901;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3);

    function Web$Kaelin$Action$cast$(_range$1, _hex_effect$2, _state$3, _addr$4) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $903 = self.room;
                var $904 = self.tick;
                var $905 = self.players;
                var $906 = self.map;
                var $907 = self.interface;
                var self = $907;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $909 = self.mouse_pos;
                        var _hero_coord$13 = Web$Kaelin$Map$id_coord$(_addr$4, $906);
                        var self = _hero_coord$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $911 = self.value;
                                var _mouse_coord$15 = Web$Kaelin$Coord$to_axial$($909);
                                var _cast_info$16 = Web$Kaelin$CastInfo$new$(_mouse_coord$15, $911, _range$1, _hex_effect$2);
                                var $912 = Web$Kaelin$State$game$($903, $904, $905, Maybe$some$(_cast_info$16), $906, $907);
                                var $910 = $912;
                                break;
                            case 'Maybe.none':
                                var $913 = _state$3;
                                var $910 = $913;
                                break;
                        };
                        var $908 = $910;
                        break;
                };
                var $902 = $908;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $914 = _state$3;
                var $902 = $914;
                break;
        };
        return $902;
    };
    const Web$Kaelin$Action$cast = x0 => x1 => x2 => x3 => Web$Kaelin$Action$cast$(x0, x1, x2, x3);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $916 = self.i;
                var $917 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $919 = self.i;
                        var $920 = self.j;
                        var $921 = (($916 === $919) && ($917 === $920));
                        var $918 = $921;
                        break;
                };
                var $915 = $918;
                break;
        };
        return $915;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);
    const Web$Kaelin$HexEffect$movement = ({
        _: 'Web.Kaelin.HexEffect.movement'
    });

    function Web$Kaelin$Action$select$(_state$1, _addr$2) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $923 = self.map;
                var $924 = self.interface;
                var self = $924;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $926 = self.mouse_pos;
                        var _coord$11 = Maybe$default$(Web$Kaelin$Map$id_coord$(_addr$2, $923), Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n))));
                        var _pos$12 = $926;
                        var self = _pos$12;
                        switch (self._) {
                            case 'Pair.new':
                                var self = _pos$12;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $929 = self.fst;
                                        var $930 = self.snd;
                                        var _mouse$17 = Web$Kaelin$Coord$to_axial$(Pair$new$($929, $930));
                                        var self = Web$Kaelin$Coord$eql$(_coord$11, _mouse$17);
                                        if (self) {
                                            var $932 = Web$Kaelin$Action$cast$(2n, Web$Kaelin$HexEffect$movement, _state$1, _addr$2);
                                            var $931 = $932;
                                        } else {
                                            var $933 = _state$1;
                                            var $931 = $933;
                                        };
                                        var $928 = $931;
                                        break;
                                };
                                var $927 = $928;
                                break;
                        };
                        var $925 = $927;
                        break;
                };
                var $922 = $925;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $934 = _state$1;
                var $922 = $934;
                break;
        };
        return $922;
    };
    const Web$Kaelin$Action$select = x0 => x1 => Web$Kaelin$Action$select$(x0, x1);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.tick':
                var $936 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $938 = App$pass;
                        var $937 = $938;
                        break;
                    case 'Web.Kaelin.State.game':
                        var _info$11 = $936;
                        var $939 = App$store$(Web$Kaelin$Action$update_interface$(_info$11, _state$2));
                        var $937 = $939;
                        break;
                };
                var $935 = $937;
                break;
            case 'App.Event.key_down':
                var $940 = self.code;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $942 = self.room;
                        var self = ($940 === 49);
                        if (self) {
                            var $944 = App$post$($942, Web$Kaelin$Command$create_player$("0x00000001"));
                            var $943 = $944;
                        } else {
                            var self = ($940 === 50);
                            if (self) {
                                var $946 = App$post$($942, Web$Kaelin$Command$create_player$("0x00000002"));
                                var $945 = $946;
                            } else {
                                var self = ($940 === 51);
                                if (self) {
                                    var $948 = App$post$($942, Web$Kaelin$Command$create_player$("0x00000003"));
                                    var $947 = $948;
                                } else {
                                    var self = ($940 === 52);
                                    if (self) {
                                        var $950 = App$post$($942, Web$Kaelin$Command$create_player$("0x00000004"));
                                        var $949 = $950;
                                    } else {
                                        var self = ($940 === 68);
                                        if (self) {
                                            var $952 = App$post$($942, "0x2100000000000000000000000000000000000000000000000000000000000001");
                                            var $951 = $952;
                                        } else {
                                            var self = ($940 === 65);
                                            if (self) {
                                                var $954 = App$post$($942, "0x2200000000000000000000000000000000000000000000000000000000000001");
                                                var $953 = $954;
                                            } else {
                                                var self = ($940 === 87);
                                                if (self) {
                                                    var $956 = App$post$($942, "0x2300000000000000000000000000000000000000000000000000000000000001");
                                                    var $955 = $956;
                                                } else {
                                                    var self = ($940 === 83);
                                                    if (self) {
                                                        var $958 = App$post$($942, "0x2400000000000000000000000000000000000000000000000000000000000001");
                                                        var $957 = $958;
                                                    } else {
                                                        var self = ($940 === 90);
                                                        if (self) {
                                                            var $960 = App$post$($942, "0x3100000000000000000000000000000000000000000000000000000000000001");
                                                            var $959 = $960;
                                                        } else {
                                                            var self = ($940 === 88);
                                                            if (self) {
                                                                var $962 = App$post$($942, "0x3200000000000000000000000000000000000000000000000000000000000001");
                                                                var $961 = $962;
                                                            } else {
                                                                var $963 = App$pass;
                                                                var $961 = $963;
                                                            };
                                                            var $959 = $961;
                                                        };
                                                        var $957 = $959;
                                                    };
                                                    var $955 = $957;
                                                };
                                                var $953 = $955;
                                            };
                                            var $951 = $953;
                                        };
                                        var $949 = $951;
                                    };
                                    var $947 = $949;
                                };
                                var $945 = $947;
                            };
                            var $943 = $945;
                        };
                        var $941 = $943;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $964 = App$pass;
                        var $941 = $964;
                        break;
                };
                var $935 = $941;
                break;
            case 'App.Event.post':
                var $965 = self.addr;
                var $966 = self.data;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $968 = App$pass;
                        var $967 = $968;
                        break;
                    case 'Web.Kaelin.State.game':
                        var self = String$starts_with$($966, "0x1");
                        if (self) {
                            var _hero_id$13 = ("0x" + String$drop$(58n, $966));
                            var _hero$14 = Map$get$(_hero_id$13, Web$Kaelin$Resources$heroes);
                            var self = _hero$14;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $971 = self.value;
                                    var $972 = App$store$(Web$Kaelin$Action$create_player$($965, $971, _state$2));
                                    var $970 = $972;
                                    break;
                                case 'Maybe.none':
                                    var $973 = App$pass;
                                    var $970 = $973;
                                    break;
                            };
                            var $969 = $970;
                        } else {
                            var self = String$starts_with$($966, "0x2");
                            if (self) {
                                var self = (String$slice$(3n, 4n, $966) === "1");
                                if (self) {
                                    var $976 = Pair$new$(Int$to_i32$(Int$from_nat$(1n)), Int$to_i32$(Int$from_nat$(0n)));
                                    var self = $976;
                                } else {
                                    var self = (String$slice$(3n, 4n, $966) === "2");
                                    if (self) {
                                        var $978 = Pair$new$(Int$to_i32$(Int$neg$(Int$from_nat$(1n))), Int$to_i32$(Int$from_nat$(0n)));
                                        var $977 = $978;
                                    } else {
                                        var self = (String$slice$(3n, 4n, $966) === "3");
                                        if (self) {
                                            var $980 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$neg$(Int$from_nat$(1n))));
                                            var $979 = $980;
                                        } else {
                                            var self = (String$slice$(3n, 4n, $966) === "4");
                                            if (self) {
                                                var $982 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(1n)));
                                                var $981 = $982;
                                            } else {
                                                var $983 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n)));
                                                var $981 = $983;
                                            };
                                            var $979 = $981;
                                        };
                                        var $977 = $979;
                                    };
                                    var self = $977;
                                };
                                switch (self._) {
                                    case 'Pair.new':
                                        var $984 = self.fst;
                                        var $985 = self.snd;
                                        var $986 = App$store$(Web$Kaelin$Player$move_by$($984, $985, _state$2, $965));
                                        var $975 = $986;
                                        break;
                                };
                                var $974 = $975;
                            } else {
                                var self = String$starts_with$($966, "0x3");
                                if (self) {
                                    var self = (String$slice$(3n, 4n, $966) === "1");
                                    if (self) {
                                        var $989 = Pair$new$(1n, Web$Kaelin$HexEffect$ability);
                                        var self = $989;
                                    } else {
                                        var self = (String$slice$(3n, 4n, $966) === "2");
                                        if (self) {
                                            var $991 = Pair$new$(2n, Web$Kaelin$HexEffect$ability);
                                            var $990 = $991;
                                        } else {
                                            var $992 = Pair$new$(0n, Web$Kaelin$HexEffect$ability);
                                            var $990 = $992;
                                        };
                                        var self = $990;
                                    };
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $993 = self.fst;
                                            var $994 = self.snd;
                                            var $995 = App$store$(Web$Kaelin$Action$cast$($993, $994, _state$2, $965));
                                            var $988 = $995;
                                            break;
                                    };
                                    var $987 = $988;
                                } else {
                                    var self = String$starts_with$($966, "0x4");
                                    if (self) {
                                        var $997 = App$store$(Web$Kaelin$Action$select$(_state$2, $965));
                                        var $996 = $997;
                                    } else {
                                        var $998 = App$pass;
                                        var $996 = $998;
                                    };
                                    var $987 = $996;
                                };
                                var $974 = $987;
                            };
                            var $969 = $974;
                        };
                        var $967 = $969;
                        break;
                };
                var $935 = $967;
                break;
            case 'App.Event.init':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1000 = App$pass;
                        var $999 = $1000;
                        break;
                    case 'Web.Kaelin.State.game':
                        var $1001 = App$watch$(Web$Kaelin$Constants$room);
                        var $999 = $1001;
                        break;
                };
                var $935 = $999;
                break;
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_out':
            case 'App.Event.resize':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1003 = App$pass;
                        var $1002 = $1003;
                        break;
                };
                var $935 = $1002;
                break;
            case 'App.Event.mouse_click':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1005 = App$pass;
                        var $1004 = $1005;
                        break;
                };
                var $935 = $1004;
                break;
        };
        return $935;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1006 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1006;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1007 = App$new$(_init$2, _draw$3, _when$4);
        return $1007;
    })();
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Word.i': Word$i,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'Web.Kaelin.Constants.room': Web$Kaelin$Constants$room,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'Web.Kaelin.Entity.creature': Web$Kaelin$Entity$creature,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'Pair.new': Pair$new,
        'Word.or': Word$or,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.add': U32$add,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'VoxBox.parse': VoxBox$parse,
        'Web.Kaelin.Assets.hero.croni0_d_1': Web$Kaelin$Assets$hero$croni0_d_1,
        'Web.Kaelin.Hero.croni': Web$Kaelin$Hero$croni,
        'Web.Kaelin.Assets.hero.cyclope_d_1': Web$Kaelin$Assets$hero$cyclope_d_1,
        'Web.Kaelin.Hero.cyclope': Web$Kaelin$Hero$cyclope,
        'Web.Kaelin.Assets.hero.lela_d_1': Web$Kaelin$Assets$hero$lela_d_1,
        'Web.Kaelin.Hero.lela': Web$Kaelin$Hero$lela,
        'Web.Kaelin.Assets.hero.octoking_d_1': Web$Kaelin$Assets$hero$octoking_d_1,
        'Web.Kaelin.Hero.octoking': Web$Kaelin$Hero$octoking,
        'Maybe.default': Maybe$default,
        'List': List,
        'I32.new': I32$new,
        'I32.add': I32$add,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.mul': I32$mul,
        'Int.to_nat': Int$to_nat,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.abs': Word$abs,
        'Int.neg': Int$neg,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
        'Web.Kaelin.Coord.Convert.axial_to_nat': Web$Kaelin$Coord$Convert$axial_to_nat,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.get': NatMap$get,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.cons': List$cons,
        'NatMap.set': NatMap$set,
        'Web.Kaelin.Map.set': Web$Kaelin$Map$set,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Map.init': Web$Kaelin$Map$init,
        'NatMap.new': NatMap$new,
        'Web.Kaelin.Constants.map_size': Web$Kaelin$Constants$map_size,
        'Web.Kaelin.Terrain.grass': Web$Kaelin$Terrain$grass,
        'Web.Kaelin.Assets.tile.dark_grass_4': Web$Kaelin$Assets$tile$dark_grass_4,
        'Web.Kaelin.Assets.tile.hex_range': Web$Kaelin$Assets$tile$hex_range,
        'Web.Kaelin.Assets.tile.hex_hovered': Web$Kaelin$Assets$tile$hex_hovered,
        'Web.Kaelin.Entity.background': Web$Kaelin$Entity$background,
        'NatMap': NatMap,
        'I32.sub': I32$sub,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'U32.to_i32': U32$to_i32,
        'I32.abs': I32$abs,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Web.Kaelin.Map.arena': Web$Kaelin$Map$arena,
        'App.EnvInfo.new': App$EnvInfo$new,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.App.init': Web$Kaelin$App$init,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'BitsMap.to_list.go': BitsMap$to_list$go,
        'List.mapped': List$mapped,
        'Bits.to_nat': Bits$to_nat,
        'NatMap.to_list': NatMap$to_list,
        'List.for': List$for,
        'Pair.fst': Pair$fst,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.div': Nat$div,
        'Int.add': Int$add,
        'Int.sub': Int$sub,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Web.Kaelin.Coord.Convert.nat_to_axial': Web$Kaelin$Coord$Convert$nat_to_axial,
        'Web.Kaelin.Constants.hexagon_radius': Web$Kaelin$Constants$hexagon_radius,
        'I32.div': I32$div,
        'Web.Kaelin.Constants.center_x': Web$Kaelin$Constants$center_x,
        'Web.Kaelin.Constants.center_y': Web$Kaelin$Constants$center_y,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'U32.sub': U32$sub,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'Web.Kaelin.Draw.state.background': Web$Kaelin$Draw$state$background,
        'Web.Kaelin.Coord.Cubic.new': Web$Kaelin$Coord$Cubic$new,
        'Web.Kaelin.Coord.Convert.axial_to_cubic': Web$Kaelin$Coord$Convert$axial_to_cubic,
        'List.map': List$map,
        'Web.Kaelin.Coord.Convert.cubic_to_axial': Web$Kaelin$Coord$Convert$cubic_to_axial,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Cmp.inv': Cmp$inv,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'Web.Kaelin.Coord.Cubic.add': Web$Kaelin$Coord$Cubic$add,
        'List.concat': List$concat,
        'Web.Kaelin.Coord.Cubic.range': Web$Kaelin$Coord$Cubic$range,
        'Web.Kaelin.Coord.Axial.range': Web$Kaelin$Coord$Axial$range,
        'Web.Kaelin.Draw.terrain': Web$Kaelin$Draw$terrain,
        'Web.Kaelin.Draw.state.range_cast': Web$Kaelin$Draw$state$range_cast,
        'Web.Kaelin.Draw.hero': Web$Kaelin$Draw$hero,
        'Web.Kaelin.Draw.state.players': Web$Kaelin$Draw$state$players,
        'Web.Kaelin.Draw.state': Web$Kaelin$Draw$state,
        'Web.Kaelin.App.draw': Web$Kaelin$App$draw,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'U16.eql': U16$eql,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.post': App$post,
        'String.nil': String$nil,
        'String.repeat': String$repeat,
        'String.drop': String$drop,
        'Web.Kaelin.Command.create_player': Web$Kaelin$Command$create_player,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Map.get': Map$get,
        'List.fold': List$fold,
        'Map.set': Map$set,
        'Web.Kaelin.Resources.heroes': Web$Kaelin$Resources$heroes,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'String.take': String$take,
        'String.slice': String$slice,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.id_coord': Web$Kaelin$Map$id_coord,
        'Bool.or': Bool$or,
        'Web.Kaelin.Map.is_occupied': Web$Kaelin$Map$is_occupied,
        'List.pop_at.go': List$pop_at$go,
        'List.pop_at': List$pop_at,
        'Web.Kaelin.Map.pop_at': Web$Kaelin$Map$pop_at,
        'Web.Kaelin.Map.swap': Web$Kaelin$Map$swap,
        'Web.Kaelin.Player.move': Web$Kaelin$Player$move,
        'Web.Kaelin.Player.move_by': Web$Kaelin$Player$move_by,
        'Web.Kaelin.HexEffect.ability': Web$Kaelin$HexEffect$ability,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
        'F64.sub': F64$sub,
        'F64.mul': F64$mul,
        'F64.add': F64$add,
        'Web.Kaelin.Coord.round.floor': Web$Kaelin$Coord$round$floor,
        'Web.Kaelin.Coord.round.round_F64': Web$Kaelin$Coord$round$round_F64,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'Web.Kaelin.Coord.round.diff': Web$Kaelin$Coord$round$diff,
        'Web.Kaelin.Coord.round': Web$Kaelin$Coord$round,
        'Web.Kaelin.Coord.to_axial': Web$Kaelin$Coord$to_axial,
        'Web.Kaelin.CastInfo.new': Web$Kaelin$CastInfo$new,
        'Web.Kaelin.Action.cast': Web$Kaelin$Action$cast,
        'I32.eql': I32$eql,
        'Web.Kaelin.Coord.eql': Web$Kaelin$Coord$eql,
        'Web.Kaelin.HexEffect.movement': Web$Kaelin$HexEffect$movement,
        'Web.Kaelin.Action.select': Web$Kaelin$Action$select,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();