import { useMemo, } from "react";

/**
 * ============================================================
 *  EDIT THIS CONFIG WITH REAL DETAILS
 *  Everything on the page is driven from here.
 * ============================================================
 */
const CONFIG = {
  name: "Eva Fertility and Laparoscopy (स्त्री क्लिनिक)",
  credentials: "Dr. Raveendra Gondhali",
  specialty: "Senior Gynecologist & Obstretics, Infertility & IVF MS(OBGY), MBBS, F.MAS Obstetrics & Gynecology",
  photoUrl: "/images/logo.jpeg", // paste an image URL here, or leave blank for the monogram

 hours: [
  {
    day: "Mon–Sat",
    slots: [
      ["9:00", "18:00", "By Appointment"],
      ["18:00", "21:00", "OPD"]
    ]
  },
  {
    day: "Sunday",
    slots: [
      ["9:00", "14:00", "By Appointment"]
    ]
  }
],

  address: "Eva Fertility & Laparoscopy (स्त्री क्लिनिक), Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon, Pimpri-Chinchwad, Pune 411033",
  mapsUrl: "https://maps.google.com/?q=123+MG+Road+Camp+Pune",

  phone: "+91 70661 04777",
  email: "evafertilitypune@gmail.com",
  whatsapp: "+91 86054 70491",
  website: "https://evafertilitypune.com",

  socials: [
    { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { label: "Facebook", url: "https://facebook.com/", icon: "facebook" },
    { label: "LinkedIn", url: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", url: "https://youtube.com/", icon: "youtube" },
  ],

  qrTargetUrl: "https://hospital-management-frontend-gold.vercel.app/DrRaveendraGondhali",
};

/**
 * ============================================================
 *  SELF-CONTAINED QR CODE ENCODER — no npm package, no network call.
 *  Adapted from the public-domain "qrcode-generator" algorithm
 *  (Kazuhiko Arase). Produces a boolean matrix that <QRCodeSVG>
 *  below renders as inline SVG rectangles.
 * ============================================================
 */
const QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
const QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
const QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };

const QRUtil = {
  PATTERN_POSITION_TABLE: [
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
    [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78],
    [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170],
  ],
  G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
  G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
  getBCHDigit(data) {
    let digit = 0;
    while (data !== 0) { digit++; data >>>= 1; }
    return digit;
  },
  getBCHTypeInfo(data) {
    let d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15));
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK;
  },
  getBCHTypeNumber(data) {
    let d = data << 12;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18));
    }
    return (data << 12) | d;
  },
  getPatternPosition(typeNumber) { return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]; },
  getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000: return (i + j) % 2 === 0;
      case QRMaskPattern.PATTERN001: return i % 2 === 0;
      case QRMaskPattern.PATTERN010: return j % 3 === 0;
      case QRMaskPattern.PATTERN011: return (i + j) % 3 === 0;
      case QRMaskPattern.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case QRMaskPattern.PATTERN101: return ((i * j) % 2) + ((i * j) % 3) === 0;
      case QRMaskPattern.PATTERN110: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case QRMaskPattern.PATTERN111: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
      default: throw new Error(`bad maskPattern: ${maskPattern}`);
    }
  },
  getErrorCorrectPolynomial(errorCorrectLength) {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    return a;
  },
  getLengthInBits(mode, type) {
    if (type >= 1 && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER: return 10;
        case QRMode.MODE_ALPHA_NUM: return 9;
        case QRMode.MODE_8BIT_BYTE: return 8;
        case QRMode.MODE_KANJI: return 8;
        default: throw new Error(`mode: ${mode}`);
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER: return 12;
        case QRMode.MODE_ALPHA_NUM: return 11;
        case QRMode.MODE_8BIT_BYTE: return 16;
        case QRMode.MODE_KANJI: return 10;
        default: throw new Error(`mode: ${mode}`);
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER: return 14;
        case QRMode.MODE_ALPHA_NUM: return 13;
        case QRMode.MODE_8BIT_BYTE: return 16;
        case QRMode.MODE_KANJI: return 12;
        default: throw new Error(`mode: ${mode}`);
      }
    } else {
      throw new Error(`type: ${type}`);
    }
  },
  getLostPoint(qrCode) {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) continue;
            if (r === 0 && c === 0) continue;
            if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
          }
        }
        if (sameCount > 5) lostPoint += 3 + sameCount - 5;
      }
    }
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrCode.isDark(row, col)) count++;
        if (qrCode.isDark(row + 1, col)) count++;
        if (qrCode.isDark(row, col + 1)) count++;
        if (qrCode.isDark(row + 1, col + 1)) count++;
        if (count === 0 || count === 4) lostPoint += 3;
      }
    }
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) &&
            qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) &&
            qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) for (let row = 0; row < moduleCount; row++) if (qrCode.isDark(row, col)) darkCount++;
    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  },
};

const QRMath = {
  EXP_TABLE: new Array(256),
  LOG_TABLE: new Array(256),
  glog(n) { if (n < 1) throw new Error(`glog(${n})`); return QRMath.LOG_TABLE[n]; },
  gexp(n) { while (n < 0) n += 255; while (n >= 256) n -= 255; return QRMath.EXP_TABLE[n]; },
};
for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
for (let i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

class QRPolynomial {
  constructor(num, shift) {
    if (num.length === undefined) throw new Error(`${num.length}/${shift}`);
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
  }
  get(index) { return this.num[index]; }
  getLength() { return this.num.length; }
  multiply(e) {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) for (let j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
    return new QRPolynomial(num, 0);
  }
  mod(e) {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    return new QRPolynomial(num, 0).mod(e);
  }
}

const RS_BLOCK_TABLE = [
  [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
  [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
  [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
  [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
  [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
  [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
  [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
  [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
  [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
  [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16],
  [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13],
  [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15],
  [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12],
  [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13],
  [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13],
  [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16],
  [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15],
  [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15],
  [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14],
  [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16],
  [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17],
  [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13],
  [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16],
  [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17],
  [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16],
  [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17],
  [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16],
  [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16],
  [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16],
  [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16],
  [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16],
  [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16],
  [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16],
  [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17],
  [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16],
  [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16],
  [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16],
  [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16],
  [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16],
  [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16],
];

class QRRSBlock {
  constructor(totalCount, dataCount) { this.totalCount = totalCount; this.dataCount = dataCount; }
  static getRSBlocks(typeNumber, errorCorrectLevel) {
    const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (!rsBlock) throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i++) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
    }
    return list;
  }
  static getRsBlockTable(typeNumber, errorCorrectLevel) {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default: return undefined;
    }
  }
}

class QRBitBuffer {
  constructor() { this.buffer = []; this.length = 0; }
  get(index) { const bufIndex = Math.floor(index / 8); return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1; }
  put(num, length) { for (let i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) === 1); }
  getLengthInBits() { return this.length; }
  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) this.buffer.push(0);
    if (bit) this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    this.length++;
  }
}

class QR8bitByte {
  constructor(data) { this.mode = QRMode.MODE_8BIT_BYTE; this.data = data; this.bytes = QR8bitByte.toUTF8Bytes(data); }
  static toUTF8Bytes(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
      let code = s.codePointAt(i);
      if (code > 0xffff) i++;
      if (code < 0x80) bytes.push(code);
      else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      else if (code < 0x10000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      else bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
    return bytes;
  }
  getLength() { return this.bytes.length; }
  write(buffer) { for (let i = 0; i < this.bytes.length; i++) buffer.put(this.bytes[i], 8); }
}

function qrCreateBytes(buffer, rsBlocks) {
  let offset = 0, maxDcCount = 0, maxEcCount = 0;
  const dcdata = new Array(rsBlocks.length);
  const ecdata = new Array(rsBlocks.length);
  for (let r = 0; r < rsBlocks.length; r++) {
    const dcCount = rsBlocks[r].dataCount;
    const ecCount = rsBlocks[r].totalCount - dcCount;
    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);
    dcdata[r] = new Array(dcCount);
    for (let i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
    offset += dcCount;
    const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
    const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
    const modPoly = rawPoly.mod(rsPoly);
    ecdata[r] = new Array(rsPoly.getLength() - 1);
    for (let i = 0; i < ecdata[r].length; i++) {
      const modIndex = i + modPoly.getLength() - ecdata[r].length;
      ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
    }
  }
  let totalCodeCount = 0;
  for (let i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
  const data = new Array(totalCodeCount);
  let index = 0;
  for (let i = 0; i < maxDcCount; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < dcdata[r].length) data[index++] = dcdata[r][i];
  for (let i = 0; i < maxEcCount; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < ecdata[r].length) data[index++] = ecdata[r][i];
  return data;
}

function qrCreateData(typeNumber, errorCorrectLevel, dataList) {
  const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
  const buffer = new QRBitBuffer();
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    buffer.put(data.mode, 4);
    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
    data.write(buffer);
  }
  let totalDataCount = 0;
  for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
  if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error(`code length overflow. (${buffer.getLengthInBits()}>${totalDataCount * 8})`);
  if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
  while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
  while (true) {
    if (buffer.getLengthInBits() >= totalDataCount * 8) break;
    buffer.put(0xec, 8);
    if (buffer.getLengthInBits() >= totalDataCount * 8) break;
    buffer.put(0x11, 8);
  }
  return qrCreateBytes(buffer, rsBlocks);
}

class QRCodeModel {
  constructor(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataList = [];
  }
  addData(data) { this.dataList.push(new QR8bitByte(data)); }
  isDark(row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(`${row},${col}`);
    return this.modules[row][col];
  }
  getModuleCount() { return this.moduleCount; }
  make() { this.makeImpl(false, this.getBestMaskPattern()); }
  makeImpl(test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) this.modules[row] = new Array(this.moduleCount).fill(null);
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);
    if (this.typeNumber >= 7) this.setupTypeNumber(test);
    if (this.dataCache == null) this.dataCache = qrCreateData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    this.mapData(this.dataCache, maskPattern);
  }
  setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        const dark = (0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4);
        this.modules[row + r][col + c] = dark;
      }
    }
  }
  getBestMaskPattern() {
    let minLostPoint = 0, pattern = 0;
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(this);
      if (i === 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; }
    }
    return pattern;
  }
  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) { if (this.modules[r][6] != null) continue; this.modules[r][6] = r % 2 === 0; }
    for (let c = 8; c < this.moduleCount - 8; c++) { if (this.modules[6][c] != null) continue; this.modules[6][c] = c % 2 === 0; }
  }
  setupPositionAdjustPattern() {
    const pos = QRUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i], col = pos[j];
        if (this.modules[row][col] != null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const dark = r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
            this.modules[row + r][col + c] = dark;
          }
        }
      }
    }
  }
  setupTypeNumber(test) {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber);
    for (let i = 0; i < 18; i++) { const mod = !test && ((bits >> i) & 1) === 1; this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod; }
    for (let i = 0; i < 18; i++) { const mod = !test && ((bits >> i) & 1) === 1; this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod; }
  }
  setupTypeInfo(test, maskPattern) {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) this.modules[i][8] = mod;
      else if (i < 8) this.modules[i + 1][8] = mod;
      else this.modules[this.moduleCount - 15 + i][8] = mod;
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
      else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
      else this.modules[8][15 - i - 1] = mod;
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }
  mapData(data, maskPattern) {
    let inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            const mask = QRUtil.getMask(maskPattern, row, col - c);
            if (mask) dark = !dark;
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
      }
    }
  }
}

/** Encode text into a boolean matrix. Auto-picks the smallest QR version that fits. */
function qrEncode(text, errorCorrectLevel = QRErrorCorrectLevel.M) {
  for (let typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      const qr = new QRCodeModel(typeNumber, errorCorrectLevel);
      qr.addData(text);
      qr.make();
      const count = qr.getModuleCount();
      const matrix = new Array(count);
      for (let r = 0; r < count; r++) {
        matrix[r] = new Array(count);
        for (let c = 0; c < count; c++) matrix[r][c] = qr.isDark(r, c);
      }
      return { moduleCount: count, matrix };
    } catch (e) {
      if (typeNumber === 40) throw e;
    }
  }
}

/**
 * Renders the QR at a high pixel resolution on an off-screen <canvas> (no
 * external image, no SVG-to-image conversion — modules are drawn directly
 * as filled rectangles) and triggers a PNG download. Entirely client-side.
 */
function downloadQRPng(value, filename = "qr-code.png", pixelSize = 1024, quietZone = 2, fgColor = "#16241f", bgColor = "#ffffff") {
  const { moduleCount, matrix } = qrEncode(value, QRErrorCorrectLevel.M);
  const dim = moduleCount + quietZone * 2;
  const scale = Math.max(1, Math.floor(pixelSize / dim));
  const canvasSize = dim * scale;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = fgColor;
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        ctx.fillRect((c + quietZone) * scale, (r + quietZone) * scale, scale, scale);
      }
    }
  }

  const triggerDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      triggerDownload(url);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  } else {
    triggerDownload(canvas.toDataURL("image/png"));
  }
}

/** Renders a QR code as inline SVG — no image request, generated entirely client-side. */
function QRCodeSVG({ value, size = 96, quietZone = 2, fgColor = "#16241f", bgColor = "#ffffff", className }) {
  const { moduleCount, matrix } = useMemo(() => qrEncode(value, QRErrorCorrectLevel.M), [value]);
  const dim = moduleCount + quietZone * 2;

  let path = "";
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        const x = c + quietZone;
        const y = r + quietZone;
        path += `M${x},${y}h1v1h-1z`;
      }
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      role="img"
      aria-label="QR code"
      shapeRendering="crispEdges"
    >
      <rect width={dim} height={dim} fill={bgColor} />
      <path d={path} fill={fgColor} />
    </svg>
  );
}

/** ---------- helpers ---------- */

function useIsOpenNow(hours) {
  return useMemo(() => {
    const now = new Date();
    const dayIdx = now.getDay(); // 0 Sun ... 6 Sat
    const label = dayIdx === 0 ? "Sunday" : "Mon–Sat";
    const today = hours.find((h) => h.day === label);
    if (!today || today.slots.length === 0) return false;
    const mins = now.getHours() * 60 + now.getMinutes();
    return today.slots.some(([start, end]) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const s = sh * 60 + sm;
      const e = eh * 60 + em;
      return mins >= s && mins <= e;
    });
  }, [hours]);
}

/** brand + utility icons (social row) */
const ICONS = {
  instagram: (
    <path d="M12 2.2c2.7 0 3 .01 4.1.06 1.05.05 1.62.22 2 .37.5.2.86.43 1.24.8.37.38.6.74.8 1.24.15.38.32.95.37 2 .05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.05-.22 1.62-.37 2-.2.5-.43.86-.8 1.24-.38.37-.74.6-1.24.8-.38.15-.95.32-2 .37-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.05-.05-1.62-.22-2-.37a3.3 3.3 0 0 1-1.24-.8 3.3 3.3 0 0 1-.8-1.24c-.15-.38-.32-.95-.37-2C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.1c.05-1.05.22-1.62.37-2 .2-.5.43-.86.8-1.24.38-.37.74-.6 1.24-.8.38-.15.95-.32 2-.37C9 2.21 9.3 2.2 12 2.2zm0 1.8c-2.65 0-2.96.01-4.01.06-.86.04-1.33.18-1.64.3-.41.16-.7.35-1.01.66-.31.31-.5.6-.66 1.01-.12.31-.26.78-.3 1.64C4.33 8.72 4.32 9.02 4.32 12s.01 3.28.06 4.33c.04.86.18 1.33.3 1.64.16.41.35.7.66 1.01.31.31.6.5 1.01.66.31.12.78.26 1.64.3 1.05.05 1.36.06 4.01.06s2.96-.01 4.01-.06c.86-.04 1.33-.18 1.64-.3.41-.16.7-.35 1.01-.66.31-.31.5-.6.66-1.01.12-.31.26-.78.3-1.64.05-1.05.06-1.36.06-4.33s-.01-3.28-.06-4.33c-.04-.86-.18-1.33-.3-1.64a2.7 2.7 0 0 0-.66-1.01 2.7 2.7 0 0 0-1.01-.66c-.31-.12-.78-.26-1.64-.3C14.96 4.01 14.65 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-2a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
  ),
  facebook: (
    <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.53c0-.86.24-1.44 1.47-1.44h1.57V4.45c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.99v2.96h2.47V21h3.04z" />
  ),
  linkedin: (
    <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.2a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.45 20h-3.37v-6.02c0-1.44-.03-3.28-2-3.28-2.01 0-2.32 1.57-2.32 3.18V20H9.4V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20z" />
  ),
  youtube: (
    <path d="M22 12s0-3.24-.41-4.8a2.75 2.75 0 0 0-1.94-1.95C18.1 5 12 5 12 5s-6.1 0-7.65.25a2.75 2.75 0 0 0-1.94 1.95C2 8.76 2 12 2 12s0 3.24.41 4.8a2.75 2.75 0 0 0 1.94 1.95C5.9 19 12 19 12 19s6.1 0 7.65-.25a2.75 2.75 0 0 0 1.94-1.95C22 15.24 22 12 22 12zM9.9 15.4V8.6l6 3.4-6 3.4z" />
  ),
  call: (
    <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.2c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1z" />
  ),
  mail: (
    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.3V17h16V7.3l-7.4 5.5a1 1 0 0 1-1.2 0L4 7.3zm.6-.3 7.4 5.5L19.4 7H4.6z" />
  ),
  whatsapp: (
    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.9-1.3A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.1 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1-.1-.1-.2-.1-.4-.2z" />
  ),
  globe: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 8h-3.1a15 15 0 0 0-1.2-4.6A8 8 0 0 1 18.9 10zM12 4.1c.7 1 1.4 2.7 1.7 5.9h-3.4C10.6 6.8 11.3 5.1 12 4.1zM4 12c0-.7.1-1.4.2-2h3.4c-.1.6-.1 1.3-.1 2s0 1.4.1 2H4.2c-.1-.6-.2-1.3-.2-2zm1.1 4h3.1a15 15 0 0 0 1.2 4.6A8 8 0 0 1 5.1 16zm3.1-8H5.1a8 8 0 0 1 4.3-4.6A15 15 0 0 0 8.2 8zM12 19.9c-.7-1-1.4-2.7-1.7-5.9h3.4c-.3 3.2-1 4.9-1.7 5.9zm-1.9-7.9c-.1-.6-.1-1.3-.1-2s0-1.4.1-2h3.8c.1.6.1 1.3.1 2s0 1.4-.1 2h-3.8zm4.1 7.5a15 15 0 0 0 1.2-4.6h3.1a8 8 0 0 1-4.3 4.6zM16.4 14c.1-.6.1-1.3.1-2s0-1.4-.1-2h3.4c.1.6.2 1.3.2 2s-.1 1.4-.2 2h-3.4z" />
  ),
  download: (
    <path d="M12 3a1 1 0 0 1 1 1v9.6l2.6-2.6a1 1 0 1 1 1.4 1.4l-4.3 4.3a1 1 0 0 1-1.4 0L7 12.4A1 1 0 1 1 8.4 11L11 13.6V4a1 1 0 0 1 1-1zM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
  ),
};

/** signature element: animated ECG / pulse trace, used as thin dividers */
function PulseTrace({ id = "pt" }) {
  return (
    <svg className="pulse-trace" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="85%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 12 H130 L145 12 L155 3 L165 20 L175 12 L190 12 H400"
        fill="none"
        stroke={`url(#fade-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DoctorLandingPage() {
  const isOpen = useIsOpenNow(CONFIG.hours);

  const initials = CONFIG.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const telHref = `tel:${CONFIG.phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${CONFIG.whatsapp.replace(/[^0-9]/g, "")}`;
  const websiteHost = CONFIG.website.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="page">
      <style>{`
        :root {
          --ink: #16241f;
          --paper: #eef2ed;
          --paper-2: #fff7fc;
          --teal: #3157b7;
          --teal-deep: #002277;
          --coral: #e2543f;
          --line: #d7ded4;
          --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          --serif: 'Fraunces', Georgia, serif;
          --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; }

        .page {
          height: 100dvh;
          width: 100vw;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .shell {
          width: 100%;
          height: 100%;
          // max-width: 460px;
          // max-height: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(10px, 3vh, 22px) clamp(14px, 4.5vw, 24px);
          gap: clamp(6px, 1.4vh, 12px);
          min-height: 0;
          overflow: hidden;
        }

        /* ---- identity bar ---- */
        .identity {
          display: flex;
          align-items: center;
          gap: clamp(10px, 3vw, 14px);
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-deep) 100%);
          border-radius: 16px;
          padding: clamp(10px, 2.2vh, 16px) clamp(12px, 3.5vw, 18px);
          color: #fff;
          flex: 0 0 auto;
        }
        .avatar {
          width: clamp(44px, 12vw, 58px);
          height: clamp(44px, 12vw, 58px);
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif);
          font-size: clamp(15px, 4vw, 20px);
          flex-shrink: 0;
          overflow: hidden;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .identity-text { min-width: 0; flex: 1; }
        .name {
          font-family: var(--serif);
          font-weight: 600;
          font-size: clamp(15px, 4.6vw, 20px);
          line-height: 1.5;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cred-spec {
          font-size: clamp(10.5px, 2.8vw, 12.5px);
          opacity: 0.9;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-row {
          display: flex; align-items: center; gap: 6px;
          margin-top: 5px;
          font-family: var(--mono);
          font-size: clamp(9.5px, 2.4vw, 11px);
          letter-spacing: 0.04em;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${isOpen ? "#7CE0B8" : "#f2a7a7"};
          flex-shrink: 0;
        }
        .dot.open { animation: blip 1.6s ease-in-out infinite; }
        @keyframes blip {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,224,184,0.55); }
          50% { box-shadow: 0 0 0 5px rgba(124,224,184,0); }
        }

        .pulse-trace { width: 100%; height: clamp(10px, 2vh, 16px); display: block; flex: 0 0 auto; }

        /* ---- generic mini card ---- */
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(8px, 2.2vw, 12px);
          flex: 1 1 auto;
          min-height: 0;
        }
        .mini-card {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: clamp(9px, 2vh, 13px) clamp(10px, 2.5vw, 14px);
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: clamp(8.5px, 2vw, 9.5px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal-deep);
          margin-bottom: clamp(5px, 1.2vh, 8px);
        }

        .hours-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: clamp(3px, 0.8vh, 6px) 0;
          border-bottom: 1px dashed var(--line);
          font-family: var(--mono);
          font-size: clamp(10.5px, 2.6vw, 12.5px);
        }
        .hours-row:last-child { border-bottom: none; }
        .hours-day { font-weight: 600; }
        .hours-slots { color: #5b6b62; text-align: right; }
        .closed-tag { color: #b56464; }

        .addr {
          font-size: clamp(10.5px, 2.6vw, 12.5px);
          line-height: 1.4;
          color: #2b3a34;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mini-btn {
          margin-top: 6px;
          align-self: flex-start;
          font-family: var(--sans);
          font-weight: 600;
          font-size: clamp(10px, 2.4vw, 11.5px);
          color: #fff;
          background: var(--teal);
          border: none;
          border-radius: 8px;
          padding: clamp(5px, 1.2vh, 7px) clamp(9px, 2vw, 12px);
          text-decoration: none;
          white-space: nowrap;
        }

        /* ---- contact chips row ---- */
        .chip-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(6px, 1.8vw, 10px);
          flex: 0 0 auto;
        }
        .chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: clamp(7px, 1.6vh, 10px) 4px;
          text-decoration: none;
          color: var(--teal-deep);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .chip:active { background: var(--teal); color: #fff; }
        .chip svg { width: clamp(15px, 4vw, 18px); height: clamp(15px, 4vw, 18px); fill: currentColor; }
        .chip span {
          font-family: var(--mono);
          font-size: clamp(8px, 2vw, 9.5px);
          letter-spacing: 0.02em;
        }

        /* ---- social + footer row ---- */
        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex: 0 0 auto;
        }
        .social-row { display: flex; gap: clamp(6px, 1.8vw, 9px); }
        .social-chip {
          width: clamp(28px, 7.5vw, 34px);
          height: clamp(28px, 7.5vw, 34px);
          border-radius: 50%;
          background: var(--paper-2);
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--teal-deep);
          text-decoration: none;
        }
        .social-chip svg { width: 45%; height: 45%; fill: currentColor; }

        .qr-mini {
          display: flex; align-items: center; gap: 7px;
          min-width: 0;
        }
        .qr-mini > svg {
          width: clamp(34px, 9vw, 42px);
          height: clamp(34px, 9vw, 42px);
          border-radius: 6px;
          border: 1px solid var(--line);
          background: #fff;
          padding: 3px;
          flex-shrink: 0;
        }
        .qr-mini-text {
          font-family: var(--mono);
          font-size: clamp(8px, 2vw, 9.5px);
          color: #6a7a71;
          line-height: 1.3;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .qr-mini-text a { color: var(--teal-deep); text-decoration: none; font-weight: 600; }
        .qr-download-btn {
          appearance: none;
          border: 1px solid var(--line);
          background: var(--paper-2);
          color: var(--teal-deep);
          width: clamp(26px, 7vw, 30px);
          height: clamp(26px, 7vw, 30px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
        }
        .qr-download-btn:active { background: var(--teal); color: #fff; }
        .qr-download-btn svg { width: 55%; height: 55%; fill: currentColor; }
      `}</style>

      <div className="shell">
        {/* IDENTITY BAR */}
        <div className="identity">
          <div className="avatar">
            {CONFIG.photoUrl ? <img src={CONFIG.photoUrl} alt={CONFIG.name} /> : initials}
          </div>
          <div className="identity-text">
            <h1 className="name">{CONFIG.name}</h1>
            <div className="cred-spec">{CONFIG.credentials} · {CONFIG.specialty}</div>
            <div className="status-row">
              <span className={`dot ${isOpen ? "open" : ""}`} />
              {isOpen ? "OPEN NOW" : "CLOSED NOW"}
            </div>
          </div>
        </div>

        <PulseTrace id="div1" />

        {/* HOURS + LOCATION */}
        <div className="">
          <div className="mini-card">
            <div className="eyebrow">Hours</div>
            {CONFIG.hours.map((h) => (
              <div className="hours-row" key={h.day}>
                <span className="hours-day">{h.day}</span>
                <span className="hours-slots">
                  {h.slots.length === 0 ? (
                    <span className="closed-tag">Closed</span>
                  ) : (
                    h.slots.map((s) => s.join("–")).join(" / ")
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mini-card">
            <div className="eyebrow">Location</div>
            <div className="addr">{CONFIG.address}</div>
            <a className="mini-btn" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
              Directions →
            </a>
          </div>
        </div>

        {/* CONTACT CHIPS */}
        <div className="chip-row">
          <a className="chip" href={telHref}>
            <svg viewBox="0 0 24 24">{ICONS.call}</svg>
            <span>CALL</span>
          </a>
          <a className="chip" href={`mailto:${CONFIG.email}`}>
            <svg viewBox="0 0 24 24">{ICONS.mail}</svg>
            <span>EMAIL</span>
          </a>
          <a className="chip" href={waHref} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24">{ICONS.whatsapp}</svg>
            <span>WHATSAPP</span>
          </a>
          <a className="chip" href={CONFIG.website} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24">{ICONS.globe}</svg>
            <span>WEBSITE</span>
          </a>
        </div>

        {/* SOCIAL + QR */}
        <div className="bottom-row">
          <div className="social-row">
            {CONFIG.socials.map((s) => (
              <a key={s.label} className="social-chip" href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                <svg viewBox="0 0 24 24">{ICONS[s.icon]}</svg>
              </a>
            ))}
          </div>
          <div className="qr-mini">
            <QRCodeSVG value={CONFIG.qrTargetUrl} size={42} quietZone={2} />
            <div className="qr-mini-text">
              <a href={CONFIG.website} target="_blank" rel="noreferrer">{websiteHost}</a>
            </div>
            <button
              className="qr-download-btn"
              type="button"
              aria-label="Download QR code as PNG"
              title="Download QR code"
              onClick={() =>
                downloadQRPng(
                  CONFIG.qrTargetUrl,
                  `${CONFIG.name.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-qr.png`,
                  1024
                )
              }
            >
              <svg viewBox="0 0 24 24">{ICONS.download}</svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}