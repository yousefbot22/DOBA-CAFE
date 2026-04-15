// script.js — تأثيرات خفيفة + تحميل بصري
document.addEventListener('DOMContentLoaded', () => {
  console.log('☕ DOBA CAFE • منيو غامق أنيق');

  // إضافة تأثير ظهور تدريجي للأعمدة
  const cols = document.querySelectorAll('.menu-col');
  cols.forEach((col, idx) => {
    col.style.opacity = '0';
    col.style.transform = 'translateY(10px)';
    setTimeout(() => {
      col.style.transition = 'opacity 0.6s ease, transform 0.4s ease';
      col.style.opacity = '1';
      col.style.transform = 'translateY(0)';
    }, idx * 60);
  });

  // إبراز العناصر عند التمرير (إضافة كلاس بسيط)
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = 'rgba(70, 50, 35, 0.25)';
      item.style.borderRadius = '20px';
      item.style.transition = '0.2s';
    });
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'transparent';
    });
  });
});
