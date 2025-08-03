
 async function createReceiptPDF() {
      const { PDFDocument, StandardFonts, rgb } = PDFLib;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size

      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pageWidth = page.getWidth();
      let yCursor = 800;

      // --- Small Header ---
      page.drawText("AN ISO 9001: 2015 CERTIFIED TRUST", {
        x: (pageWidth - normalFont.widthOfTextAtSize("AN ISO 9001: 2015 CERTIFIED TRUST", 8)) / 2,
        y: yCursor,
        size: 8,
        font: normalFont
      });
      yCursor -= 12;

      // --- Trust Registration Info ---
      const regPanText = "Trust Reg. No.: B/41 Porbandar | PAN: AARTS2214D | 80G No.: AARTS2214DF20214";
      page.drawText(regPanText, {
        x: (pageWidth - normalFont.widthOfTextAtSize(regPanText, 8)) / 2,
        y: yCursor,
        size: 8,
        font: normalFont
      });
      yCursor -= 18;

      // --- Main Heading ---
      page.drawText("SIPAI SAMAJ TRUST", {
        x: (pageWidth - boldFont.widthOfTextAtSize("SIPAI SAMAJ TRUST", 16)) / 2,
        y: yCursor,
        size: 16,
        font: boldFont
      });
      yCursor -= 18;

      // --- Address ---
      const addressLines = [
        "Chhaya Road, Near Bhartiya Vidhyalaya, Porbandar 360 575",
        "GUJARAT INDIA"
      ];
      addressLines.forEach(line => {
        page.drawText(line, {
          x: (pageWidth - normalFont.widthOfTextAtSize(line, 9)) / 2,
          y: yCursor,
          size: 9,
          font: normalFont
        });
        yCursor -= 12;
      });

      // --- Contact ---
      const contactText = "Email: Admin@sipaisamajtrust.org | www.sipaisamajtrust.org | Contact : +91 9824243218";
      page.drawText(contactText, {
        x: (pageWidth - normalFont.widthOfTextAtSize(contactText, 8)) / 2,
        y: yCursor,
        size: 8,
        font: normalFont
      });
      yCursor -= 20;

      // --- Bank Details Box ---
      const bankBoxHeight = 30;
      const bankBoxY = yCursor - bankBoxHeight;
      const bankBoxWidth = pageWidth - 80;

      page.drawRectangle({
        x: 40,
        y: bankBoxY,
        width: bankBoxWidth,
        height: bankBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      });

      const bankDetailsText = "BANK DETAILS: A/C NAME: SIPAI SAMAJ TRUST | HDFC BANK - A/C NO. 50200020537072 | IFSC: HDFC0000274";
      const textWidth = normalFont.widthOfTextAtSize(bankDetailsText, 7);
      const textX = (pageWidth - textWidth) / 2;
      const textY = bankBoxY + (bankBoxHeight / 2) - 3;

      page.drawText(bankDetailsText, {
        x: textX,
        y: textY,
        size: 7,
        font: normalFont
      });

      yCursor -= (bankBoxHeight + 25);

      // --- Receipt Info ---
      page.drawText("Receipt No: " + data.receiptNumber, { x: 40, y: yCursor, size: 9, font: boldFont });
      page.drawText("Date: " + data.date, { x: pageWidth - 120, y: yCursor, size: 9, font: boldFont });
      yCursor -= 15;

      // --- Payer Details ---
      const name = data.name;
      const address = data.address.replace(/[\r\n]+/g, '');
      const mobile = data.mobile;
      const city = data.city;
      const pincode = data.pincode;
      const taluka = data.taluka

      page.drawText("Name:", { x: 40, y: yCursor, size: 8, font: boldFont });
      page.drawText(name, { x: 140, y: yCursor, size: 8, font: normalFont });
      yCursor -= 12;	 

      page.drawText("Address:", { x: 40, y: yCursor, size: 8, font: boldFont });
      page.drawText(address, { x: 140, y: yCursor, size: 8, font: normalFont });
      yCursor -= 12;

      page.drawText("Mobile:", { x: 40, y: yCursor, size: 8, font: boldFont });
      page.drawText(mobile, { x: 140, y: yCursor, size: 8, font: normalFont });
      yCursor -= 14;

      // City, Pincode, Taluka in one row
      page.drawText("City:", { x: 40, y: yCursor, size: 8, font: boldFont });
      page.drawText(city, { x: 70, y: yCursor, size: 8, font: normalFont });

      page.drawText("Pincode:", { x: 180, y: yCursor, size: 8, font: boldFont });
      page.drawText(pincode, { x: 230, y: yCursor, size: 8, font: normalFont });

      page.drawText("District:", { x: 280, y: yCursor, size: 8, font: boldFont });
      page.drawText(taluka, { x: 320, y: yCursor, size: 8, font: normalFont });
	  
	  page.drawText("Taluka:", { x: 380, y: yCursor, size: 8, font: boldFont });
      page.drawText(taluka, { x: 420, y: yCursor, size: 8, font: normalFont });

      yCursor -= 20;

      // --- Table with Merged "Cheque / UPI Details" ---
      const startX = 40;
      const startY = yCursor;
      const colWidths = [180, 80, 160];
      const rowHeight = 16;

      const headers = ["Description", "Amount", "Cheque / UPI Details"];
      const rows = [
        ["Membership Fee", data.membershipFee],
        ["Donation", data.donation],
        ["Zakat Fund", data.zakatFund],
        ["Education Fund", data.educationFund],
        ["Marriage Bureau Fee", data.marriageFund],
        ["Widow Help Fund", data.widowFund]
      ];
	
		console.log(rows);
      //const totalAmount = rows.reduce((sum, row) => sum + parseFloat(row[1].replace(/[^0-9.-]+/g, "")), 0);
	  const totalAmount = rows.reduce((sum, row) => sum + parseFloat(row[1]), 0);

      // Add Total as last row in table
      rows.push(["Total", "Rs. " + totalAmount + ' Only']);

      // Outer table border
      const tableHeight = rowHeight * (rows.length + 1);
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);

      page.drawRectangle({
        x: startX,
        y: startY - tableHeight,
        width: tableWidth,
        height: tableHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      });

      // Draw vertical lines (Description & Amount only)
      page.drawLine({
        start: { x: startX + colWidths[0], y: startY },
        end: { x: startX + colWidths[0], y: startY - tableHeight },
        thickness: 0.5,
        color: rgb(0, 0, 0)
      });

      page.drawLine({
        start: { x: startX + colWidths[0] + colWidths[1], y: startY },
        end: { x: startX + colWidths[0] + colWidths[1], y: startY - tableHeight },
        thickness: 0.5,
        color: rgb(0, 0, 0)
      });

      // Horizontal lines for first 2 columns
      for (let i = 0; i <= rows.length + 1; i++) {
        const yLine = startY - (i * rowHeight);
        page.drawLine({
          start: { x: startX, y: yLine },
          end: { x: startX + colWidths[0] + colWidths[1], y: yLine },
          thickness: 0.5,
          color: rgb(0, 0, 0)
        });
      }

      // Headers
      headers.forEach((h, i) => {
        page.drawText(h, {
          x: startX + (colWidths.slice(0, i).reduce((a, b) => a + b, 0)) + 4,
          y: startY - 12,
          size: 8,
          font: boldFont
        });
      });

      // Rows for Description & Amount
      rows.forEach((row, i) => {
        page.drawText(row[0], { x: startX + 4, y: startY - rowHeight * (i + 1) - 12, size: 8, font: normalFont });
        if (row[0] === "Total") {
          page.drawText(row[1].toString(), { x: startX + colWidths[0] + 4, y: startY - rowHeight * (i + 1) - 12, size: 8, font: boldFont });
        } else {
			if(row[1] >0)
				page.drawText(row[1].toString(), { x: startX + colWidths[0] + 4, y: startY - rowHeight * (i + 1) - 12, size: 8, font: normalFont });
        }
      });

      // Cheque/UPI merged big cell text
      page.drawText(data.paymentDetails, { x: startX + colWidths[0] + colWidths[1] + 4, y: startY - 25, size: 8, font: normalFont });

      // Total in words
      const totalY = startY - rowHeight * (rows.length + 1);
      page.drawText("Total amount in words: " + numberToWords(totalAmount) + " only", {
        x: 40, y: totalY - 10, size: 8, font: normalFont
      });

      // Receiver's Name
      page.drawText("Receiver's Name: Asifbhai Sipai (+91 84606 78692)", {
        x: 40, y: totalY - 26, size: 8, font: normalFont
      });

      // Revenue Stamp Box
      page.drawRectangle({
        x: pageWidth - 100,
        y: totalY - 40,
        width: 50,
        height: 50,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      });
      page.drawText("Revenue", { x: pageWidth - 92, y: totalY - 18, size: 7, font: normalFont });
      page.drawText("Stamp", { x: pageWidth - 90, y: totalY - 28, size: 7, font: normalFont });

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "receipt.pdf";
      link.click();
    }

    // Number to words helper
    function numberToWords(num) {
      const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"];
      const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      if (num === 0) return "zero";
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
      if (num < 1000) return a[Math.floor(num / 100)] + " hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
      if (num < 100000) {
        return numberToWords(Math.floor(num / 1000)) + " thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
      }
      return num.toString();
    }
