CREATE TABLE `paint` ( -- UI Costomization Data
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fontColor` VARCHAR(6),
    `background_path` VARCHAR(255)
);

INSERT INTO `paint` (`id`, `fontColor`, `background_path`) VALUES
    (1, '#4287f5', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.10 - 16.28.53.59.png"),
    (2, '#35b55f', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.12 - 13.23.13.12.png"),
    (3, '#55b535', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.12 - 21.10.03.65.png"),
    (4, '#a2b535', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.15 - 21.41.40.41.png"),
    (5, '#b59b35', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.08.17 - 12.52.32.38.png"),
    (6, '#b56235', "D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.08.17 - 18.01.54.31.png");

CREATE TABLE `userDate` ( -- Custom Date Data
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `eventName` VARCHAR(50),
    `eventDate` DATE
);

INSERT INTO `userDate` (`id`, `eventName`, `eventDate`) VALUES
    (1, 'Metro Exodus Release', '2024-02-12'),
    (2, 'Cyberpunk Release', '2025-06-19'),
    (3, 'S.T.A.L.K.E.R Release', '2024-01-06'),
    (4, 'My Birtday', '2024-07-20'),
    (5, 'My App Release Date', '2024-09-30'),
    (6, 'Metro Exodus DLC Release Date', '2024-06-03');
