import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, getClientStats, getDashboardStats } from './calculations';

/** Format currency for PDF — uses "Rs." because jsPDF Helvetica doesn't render ₹ */
const pdfCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs.${num.toLocaleString('en-IN')}`;
};

/**
 * Generates and downloads a complete, professional PDF report of all FitCoach data.
 */
export const generateFitCoachPDF = ({ clients = [], sessions = [], payments = [], progress = [], settings = {} }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  const trainerName  = settings.trainerName  || 'Coach Arjun';
  const trainerTitle = settings.trainerTitle || 'Personal Trainer & Strength Coach';
  const trainerEmail = settings.email        || 'arjun.coach@fitcoach.io';
  const trainerPhone = settings.phone        || '+91 98765 00000';

  const stats = getDashboardStats(clients, sessions, payments);

  // 1. BRAND HEADER
  doc.setFillColor(11, 15, 18);
  doc.rect(0, 0, pageWidth, 42, 'F');
  doc.setFillColor(101, 243, 107);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FitCoach', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(139, 148, 158);
  doc.text('Client Management & Training Comprehensive Report', 14, 25);

  doc.setFontSize(9);
  doc.setTextColor(101, 243, 107);
  doc.text(`Generated: ${currentDateStr}`, pageWidth - 14, 18, { align: 'right' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(trainerName, pageWidth - 14, 25, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(139, 148, 158);
  doc.text(`${trainerTitle} | ${trainerPhone}`, pageWidth - 14, 31, { align: 'right' });
  doc.text(trainerEmail, pageWidth - 14, 37, { align: 'right' });

  let startY = 52;

  // 2. EXECUTIVE KPI CARDS
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 23, 27);
  doc.text('Executive Summary', 14, startY);

  const kpis = [
    { title: 'Total Clients',  value: `${stats.totalClients}` },
    { title: 'Active Clients', value: `${stats.activeClients}` },
    { title: 'Sessions Done',  value: `${stats.completedSessions}` },
    { title: 'Total Revenue',  value: pdfCurrency(stats.totalRevenue) },
    { title: 'Pending Dues',   value: pdfCurrency(stats.pendingAmount) }
  ];

  const cardWidth = (pageWidth - 28 - (kpis.length - 1) * 3) / kpis.length;
  kpis.forEach((kpi, i) => {
    const x = 14 + i * (cardWidth + 3);
    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(220, 225, 230);
    doc.roundedRect(x, startY + 4, cardWidth, 18, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 110, 120);
    doc.text(kpi.title, x + cardWidth / 2, startY + 10, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 15, 18);
    doc.text(kpi.value, x + cardWidth / 2, startY + 18, { align: 'center' });
  });

  startY += 30;

  // 3. CLIENTS DIRECTORY TABLE
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 15, 18);
  doc.text('Clients Directory', 14, startY);

  const clientRows = clients.map((client, idx) => {
    const cStats = getClientStats(client, sessions, payments);
    return [
      String(idx + 1).padStart(2, '0'),
      client.name,
      client.trainingType || 'Personal Training',
      client.phone || '-',
      `${cStats.completedSessions}/${cStats.totalSessions} (${cStats.progressPercentage}%)`,
      pdfCurrency(cStats.totalPackage),
      pdfCurrency(cStats.totalPaid),
      pdfCurrency(cStats.balance),
      client.status || 'Active'
    ];
  });

  autoTable(doc, {
    startY: startY + 4,
    head: [['#', 'Client Name', 'Training Type', 'Phone', 'Sessions', 'Package', 'Paid', 'Balance', 'Status']],
    body: clientRows,
    theme: 'grid',
    headStyles: {
      fillColor: [17, 23, 27],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: { fontSize: 7, textColor: [30, 35, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 7,  halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 28 },
      3: { cellWidth: 30 },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 22, halign: 'right' },
      8: { cellWidth: 18, halign: 'center' }
    },
    margin: { left: 14, right: 14 }
  });

  // 4. SESSIONS LOG
  doc.addPage();
  startY = 18;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 15, 18);
  doc.text('Training Sessions Log', 14, startY);

  const sessionRows = sessions.map((sess, idx) => [
    String(idx + 1).padStart(2, '0'),
    formatDate(sess.date),
    sess.startTime || '10:00 AM',
    sess.clientName,
    sess.type || 'Workout',
    `${sess.duration || 60}m`,
    sess.status || 'Scheduled',
    pdfCurrency(sess.fee || 500)
  ]);

  autoTable(doc, {
    startY: startY + 4,
    head: [['#', 'Date', 'Time', 'Client', 'Type', 'Duration', 'Status', 'Fee']],
    body: sessionRows,
    theme: 'grid',
    headStyles: { fillColor: [17, 23, 27], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7, textColor: [30, 35, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 7,  halign: 'center' },
      1: { cellWidth: 24 },
      2: { cellWidth: 22 },
      3: { cellWidth: 36 },
      4: { cellWidth: 26 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 22, halign: 'center' },
      7: { cellWidth: 26, halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });

  // 5. PAYMENTS & TRANSACTIONS
  doc.addPage();
  startY = 18;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 15, 18);
  doc.text('Payments & Transactions Log', 14, startY);

  const paymentRows = payments.map((pay, idx) => [
    String(idx + 1).padStart(2, '0'),
    formatDate(pay.date),
    pay.clientName,
    pay.sessionNumber || '#01',
    pdfCurrency(pay.amount),
    pay.method || 'UPI',
    pay.status || 'Paid',
    pay.transactionId || '-'
  ]);

  autoTable(doc, {
    startY: startY + 4,
    head: [['#', 'Date', 'Client', 'Session / Ref', 'Amount', 'Method', 'Status', 'Transaction ID']],
    body: paymentRows,
    theme: 'grid',
    headStyles: { fillColor: [17, 23, 27], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7, textColor: [30, 35, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 7,  halign: 'center' },
      1: { cellWidth: 24 },
      2: { cellWidth: 36 },
      3: { cellWidth: 22, halign: 'center' },
      4: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 30 }
    },
    margin: { left: 14, right: 14 }
  });

  // 6. PROGRESS & MEASUREMENTS
  if (progress && progress.length > 0) {
    doc.addPage();
    startY = 18;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 15, 18);
    doc.text('Client Fitness Progress & Body Measurements', 14, startY);

    const progressRows = progress.map((p, idx) => {
      const client = clients.find((c) => c.id === p.clientId);
      return [
        String(idx + 1).padStart(2, '0'),
        client ? client.name : p.clientName || 'Client',
        formatDate(p.date),
        p.weight ? `${p.weight} kg` : '-',
        p.waist  ? `${p.waist}"` : '-',
        p.chest  ? `${p.chest}"` : '-',
        p.arms   ? `${p.arms}"` : '-',
        p.bodyFat ? `${p.bodyFat}%` : '-',
        p.notes || '-'
      ];
    });

    autoTable(doc, {
      startY: startY + 4,
      head: [['#', 'Client Name', 'Date', 'Weight', 'Waist', 'Chest', 'Arms', 'Body Fat', 'Notes']],
      body: progressRows,
      theme: 'grid',
      headStyles: { fillColor: [17, 23, 27], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7, textColor: [30, 35, 42] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 7,  halign: 'center' },
        1: { cellWidth: 32 },
        2: { cellWidth: 24 },
        3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 16, halign: 'center' },
        5: { cellWidth: 16, halign: 'center' },
        6: { cellWidth: 16, halign: 'center' },
        7: { cellWidth: 18, halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });
  }

  // Footer — page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 155, 160);
    doc.text(
      `FitCoach Management System  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const fileName = `FitCoach_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};
