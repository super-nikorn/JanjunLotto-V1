import { fetchLotteryTickets } from './api/fetch-records.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tickets = await fetchLotteryTickets();
  displayTickets(tickets);
});

function displayTickets(tickets) {
  const ticketList = document.querySelector('.ticket-list');
  
  tickets.forEach(ticket => {
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';
    
    ticketCard.innerHTML = `
      <h3>เลขที่: ${ticket.number}</h3>
      <p>ชื่อ: ${ticket.name}</p>
      <p>ประเภท: ${ticket.type}</p>
      <p>จำนวนเงิน: ${ticket.amount} บาท</p>
      <p>วันที่: ${ticket.date}</p>
      <small>ID: ${ticket.id}</small>
    `;
    
    ticketList.appendChild(ticketCard);
  });
}