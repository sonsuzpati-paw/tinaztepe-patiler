/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Animal, LogEntry, ImportantMessage, User } from './types';

export const CAMPUS_LOCATIONS = [
  'Mühendislik Fakültesi',
  'Merkez Kütüphane',
  'Hukuk Fakültesi',
  'İktisadi ve İdari Bilimler Fakültesi (İİBF)',
  'Mimarlık Fakültesi',
  'Fen Fakültesi',
  'Edebiyat Fakültesi',
  'Yabancı Diller Yüksekokulu',
  'Öğrenci Sosyal Tesisleri & Yemekhane',
  'Tınaztepe Amfi Tiyatro Bölgesi',
  'Rektörlük & Ortak Alanlar',
  'Spor Kompleksi & Saha',
  'Fen Bilimleri Enstitüsü',
  'Kredi Yurtlar Kurumu (KYK) Yurdu'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin_sonsuz',
    name: 'sonsuz (Admin)',
    email: 'sonsuz.pati@gmail.com',
    phoneNumber: '0555 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    isAdmin: true
  },
  {
    id: 'user_elif',
    name: 'Elif Yılmaz',
    email: 'elif@deu.edu.tr',
    phoneNumber: '0543 987 6543',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    isAdmin: false
  },
  {
    id: 'user_ahmet',
    name: 'Ahmet Kaya',
    email: 'ahmet.kaya@deu.edu.tr',
    phoneNumber: '0532 555 1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    isAdmin: false
  },
  {
    id: 'user_buse',
    name: 'Buse Demir',
    email: 'buse@deu.edu.tr',
    phoneNumber: '0505 444 3322',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop',
    isAdmin: false
  }
];

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'animal_1',
    name: 'Sarı',
    type: 'kedi',
    gender: 'erkek',
    isNeutered: true,
    age: 'yetişkin',
    location: 'Mühendislik Fakültesi',
    locationDetails: 'A Blok kantin çevresi ve dekanlık bahçesi',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop'
    ],
    status: 'sağlıklı',
    createdAt: '2026-02-15T09:00:00Z',
    responsibleUserIds: ['user_elif', 'user_ahmet']
  },
  {
    id: 'animal_2',
    name: 'Haydut',
    type: 'köpek',
    gender: 'erkek',
    isNeutered: true,
    age: 'yaşlı',
    location: 'Merkez Kütüphane',
    locationDetails: 'Kütüphane ana girişi ve çimlik yokuş yolu',
    photos: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=600&auto=format&fit=crop'
    ],
    status: 'tedavide',
    createdAt: '2026-01-10T11:30:00Z',
    responsibleUserIds: ['user_ahmet']
  },
  {
    id: 'animal_3',
    name: 'Benek',
    type: 'kedi',
    gender: 'dişi',
    isNeutered: true,
    age: 'genç',
    location: 'Hukuk Fakültesi',
    locationDetails: 'Öğrenci bahçesi kantin yanı ve amfi girişleri',
    photos: [
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511044568932-338cba0ad801?q=80&w=600&auto=format&fit=crop'
    ],
    status: 'sağlıklı',
    createdAt: '2026-03-22T14:45:00Z',
    responsibleUserIds: ['user_buse']
  },
  {
    id: 'animal_4',
    name: 'Dost',
    type: 'köpek',
    gender: 'erkek',
    isNeutered: true,
    age: 'yetişkin',
    location: 'Öğrenci Sosyal Tesisleri & Yemekhane',
    locationDetails: 'Yemekhane arka yükleme rampası ve çevresindeki kulübeler',
    photos: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop'
    ],
    status: 'hasta',
    createdAt: '2025-11-05T08:20:00Z',
    responsibleUserIds: ['admin_sonsuz', 'user_elif']
  },
  {
    id: 'animal_5',
    name: 'Pamuk',
    type: 'kedi',
    gender: 'dişi',
    isNeutered: false,
    age: 'yavru',
    location: 'İktisadi ve İdari Bilimler Fakültesi (İİBF)',
    locationDetails: 'İİBF dekanlık iç bahçesi ve merdiven altı',
    photos: [
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=600&auto=format&fit=crop'
    ],
    status: 'acil',
    createdAt: '2026-05-18T16:00:00Z',
    responsibleUserIds: ['user_buse']
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log_1',
    animalId: 'animal_1',
    animalName: 'Sarı',
    category: 'beslenme',
    title: 'Öğleden sonra kuru mama ve yaş mama verildi',
    description: 'A blok önüne kedi evi yakınına 1 paket yaş mama konmuştur. İştahı oldukça yerindeydi, suları da tazelendi.',
    date: '2026-05-19T13:40:00Z',
    userId: 'user_elif',
    userName: 'Elif Yılmaz'
  },
  {
    id: 'log_2',
    animalId: 'animal_2',
    animalName: 'Haydut',
    category: 'ilaç',
    title: 'Eklem güçlendirici hapı sosis içinde yutturuldu',
    description: 'Günlük Glukozamin ilacı sosis parçası ile verildi. Tamamını yedi. Arka sol bacağında hafif aksama devam ediyor fakat ağrısı azalmış gibi görünüyor.',
    date: '2026-05-20T06:30:00Z',
    userId: 'user_ahmet',
    userName: 'Ahmet Kaya'
  },
  {
    id: 'log_3',
    animalId: 'animal_4',
    animalName: 'Dost',
    category: 'hastalık',
    title: 'Öksürük ve halsizlik teşhisi',
    description: 'Yemekhanedeki kulübe çevresinde uyurken yakalandı. Hafif bir hırıltısı ve öksürüğü var. Veteriner hekim Ahmet beye bilgi verildi, yarın sabah klinikten gelip kontrol edilecek.',
    date: '2026-05-19T17:15:00Z',
    userId: 'admin_sonsuz',
    userName: 'sonsuz (Admin)'
  },
  {
    id: 'log_4',
    animalId: 'animal_5',
    animalName: 'Pamuk',
    category: 'davranış',
    title: 'Dışarı çıkmaktan korkuyor, çok ürkek',
    description: 'Özellikle araba seslerinden korkup motor boşluklarına saklanmaya çalışıyor. Fakülte personeline arabaları çalıştırmadan önce kaputa vurmaları konusunda telkinde bulunuldu.',
    date: '2026-05-18T16:40:00Z',
    userId: 'user_buse',
    userName: 'Buse Demir'
  },
  {
    id: 'log_5',
    animalId: 'animal_3',
    animalName: 'Benek',
    category: 'diğer',
    title: 'İç-dış parazit damlası yenilendi',
    description: 'Boyun arkasına Broadline ense damlası uygulandı. 2 gün suyla temas etmemesi gerekiyor.',
    date: '2026-05-17T11:00:00Z',
    userId: 'user_buse',
    userName: 'Buse Demir'
  }
];

export const INITIAL_ALERTS: ImportantMessage[] = [
  {
    id: 'alert_1',
    title: 'Kampüs Genelinde Aşılama Seferberliği',
    content: 'Bu cumartesi günü (23 Mayıs) gönüllü veterinerlik öğrencileri ile kampüs genelindeki tüm köpeklerimize karma ve kuduz aşılaması yapılacaktır. Lütfen sorumlu olduğunuz köpeklerin o gün yer tespitini kolaylaştırmak için lokasyonlarını güncel tutun ve gerekirse tasma/zincir desteği sağlayın.',
    date: '2026-05-19T10:00:00Z',
    userId: 'admin_sonsuz',
    userName: 'sonsuz (Admin)',
    urgency: 'uyarı'
  },
  {
    id: 'alert_2',
    title: 'Tınaztepe Amfi Bölgesine Kuru Mama Desteği İhtiyacı',
    content: 'Amfi tiyatro ve çevresindeki ormanlık yollarda yaşayan dostlarımızın mama stokları tükenmiştir. Gidip mama verebilecek ya da oraya çuvalla kuru mama ulaştırabilecek gönüllülerin desteği acil aranmaktadır.',
    date: '2026-05-18T12:30:00Z',
    userId: 'user_elif',
    userName: 'Elif Yılmaz',
    urgency: 'acil'
  },
  {
    id: 'alert_3',
    title: 'Veteriner Borcumuz Hakkında Bilgilendirme',
    content: 'Buca Klinik\'e olan birikmiş tedavi borcumuz yapılan bağışlar sayesinde kapatılmıştır. Destek olan tüm Dokuz Eylül sakinlerine ve hocalarımıza sonsuz teşekkür ederiz! Haydut\'un ameliyat masrafı da buna dahildir.',
    date: '2026-05-16T15:20:00Z',
    userId: 'admin_sonsuz',
    userName: 'sonsuz (Admin)',
    urgency: 'duyuru'
  }
];
