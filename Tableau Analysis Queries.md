# Analysis via Tableau Desktop Professional 9.0

The data was imported into Tableau Desktop Professional Edition 9.0 for analysis and visualization. Tableau 9.0 was also used to create the interactive dashboard of the data, the “Tracing Analytics Platform,” published in the Tableau Public repository.

### Total Recovered Guns

A count of each line of data, or each firearm recovery, in the dataset by counting the distinct number of `[ID]s`

### Recovery Market

Recovery Market was defined as the following `recovery_counties`:
- Buffalo – Erie and Niagara
- Capital Region – Albany, Saratoga, Schenectady, and Rensselaer
- New York City – Bronx, Kings, New York, Queens, and Richmond
- Long Island – Nassau and Suffolk
- Lower Hudson Valley - Dutchess, Orange, Putnam, Rockland, Ulster, and Westchester
- Rochester – Monroe
- Syracuse – Onondaga

### Source State Group

`[FFL STATE NAME]` was grouped into those FFLs located in New York State (“In-State”), out of New York State (“Out-of-State”), and blank values (“Unknown”).

### Iron Pipeline

Unless otherwise noted, consists of guns sold by a dealer (FFL) located in Pennsylvania, Virginia, North Carolina, South Carolina, Georgia, and Florida.

### Out-of-State Recoveries

A count of the recovered firearm when the `[FFL STATE NAME]` was not null or not equal to New York State.

```SQL
IF [FFL STATE NAME] <> "NEW YORK"
    AND [FFL STATE NAME] <> "UNKNOWN" 
    THEN 1
    ELSE 0
END
```

### % Out-of-State

Total `[OUT OF STATE RECOVERIES]` divided by `[TOTAL RECOVERED GUNS]` where the `[FFL STATE NAME]` is known. This calculation *does not* include the 12% of guns where `[FFL STATE NAME]` is not known.

```SQL
SUM([OUT OF STATE RECOVERIES]) /
    TOTAL(COUNTD(
        IF [FFL STATE NAME]<>'UNKNOWN' 
        THEN [ID] 
        ELSE NULL 
        END
    )
)
```

### Handgun Set

Includes all firearm recoveries where `[WEAPON_TYPE]` was equal to pistol (“P”), derringer (“PD”), or revolver (“PR”).

### Number of Handguns

A count of the recovered firearm when the firearm was in the Handgun Set, or when `[WEAPON_TYPE]` was equal to pistol (“P”), derringer (“PD”), or revolver (“PR”).

```SQL
IF [HANDGUN SET] = TRUE 
    THEN 1 
    ELSE 0 
END
```

### % Handguns

The proportion of the total number of guns that are handguns.

```SQL
[NUMBER OF HANDGUNS] / [TOTAL RECOVERED GUNS]
```

### Time-to-Crime (Months)

The difference between the recovery date and the last recorded purchase date, in months.

```SQL
(([RECOVERY_DATE] - [PURCHASE_DATE]) /365) * 12
```

### Time-to-Crime (Years)

The difference between the recovery date and the last recorded purchase date, in years.

```SQL
(([RECOVERY_DATE] - [PURCHASE_DATE]) /365)
```

### Time-to-Crime (Years) Bin

Total Recovered Guns for the whole value range of `[TIME TO CRIME (YEARS)]`.

### Short Time-to-Crime Recoveries

Guns with a time-to-crime of less than three years.

```SQL
IF [TIME TO CRIME (YEARS)] < 3 
    THEN [ID]
    ELSE NULL 
END
```

### % Low Time-to-Crime Recoveries

The proportion of short time-to-crime recoveries compared to all recoveries with a known time-to-crime.

```SQL
[SHORT TIME-TO-CRIME RECOVERIES] / 
    COUNTD(
        IF [TIME TO CRIME(YEARS)] >= 0 
        THEN [ID] 
        ELSE NULL 
        END
    )
```

### Purchaser Equals Possessor Total

Adds the three columns `[PURCHASER_POSSESSOR_SAME_DATE_OF_BIRTH]`, `[PURCHASER_POSSESSOR_SAME_LAST_FIRST_NAME]`, and `[PURCHASER_POSSESSOR_SAME_STREET_ADDRESS]`.

```SQL
IFNULL([PURCHASER & POSSESSOR - SAME (LAST, FIRST) NAME],0)
    +IFNULL([PURCHASER & POSSESSOR — SAME DATE OF BIRTH],0)
    +IFNULL([PURCHASER & POSSESSOR — SAME STREET ADDRESS],0)
```

### Unrecorded Gun Transaction

If any of `[PURCHASER_POSSESSOR_SAME_DATE_OF_BIRTH]`, `[PURCHASER_POSSESSOR_SAME_LAST_FIRST_NAME]`, and `[PURCHASER_POSSESSOR_SAME_STREET_ADDRESS]` are not null, then the possessor of the firearm is considered to be the last recorded purchaser of the firearm. Mathematically, if the `[PURCHASER EQUALS POSSESSOR TOTAL]` is greater than zero, then the possessor of the firearm is considered to be the last recorded purchaser of the firearm.

```SQL
IF [PURCHASER EQUALS POSSESSOR TOTAL] > 0 
    THEN 0 
    ELSE 1 
END
```

### % Unrecorded Gun Transactions

Proportion of total guns that have an unrecorded gun transaction.

```SQL
SUM([UNRECORDED GUN TRANSACTION]) / [TOTAL RECOVERED GUNS]
```

### Time-to-Crime Index

Indexes `[TIME TO CRIME (MONTHS)]` against 600 months (50 years). Any gun with a `[TIME TO CRIME (MONTHS)]` greater than 50 years is assigned a `[TIME TO CRIME (MONTHS)]` of 600 months or a Time-to-Crime Index of zero. Any gun with a `[TIME TO CRIME (MONTHS)]` less than 0, likely occurring from data entry errors, is marked as null. All other values between 0 and 600 are divided by 600.

```SQL
IF [TIME TO CRIME (MONTHS)] >= 600 
    THEN 0
    ELSEIF [TIME TO CRIME (MONTHS)] < 0 
        THEN NULL
    ELSEIF [TIME TO CRIME (MONTHS)] >= 0
        AND [TIME TO CRIME (MONTHS)] < 600
        THEN ((600-([TIME TO CRIME (MONTHS)]))/600)
END
```

### Trafficking Index

Assigns weights to and adds Time-to-Crime Index, Unrecorded Gun Transactions, and Out-of-state Recoveries. The total value ranges between 0 (lowest) and 100 (highest).

```SQL
(.80 * [TIME TO CRIME INDEX] 
    + .10 * [UNRECORDED GUN TRANSACTION] 
    + .10 * [OUT-OF-STATERECOVERIES])*100
```

### Likely-Trafficked Gun

All guns with a trafficking index greater than or equal to 90. The term “recently trafficked” is synonymous with likely-trafficked and the two definitions are used interchangeably throughout the report.

```SQL
IF [TRAFFICKING INDEX] >= 90 
    THEN [ID] 
    ELSE NULL 
END
```

### % Likely-Trafficked Guns

The proportion of guns that have a trafficking index greater than or equal to 90 where `[FFL_STATE_NAME]` and time-to-crime is known.

```SQL
[LIKELY TRAFFICKED GUN] /
    COUNTD(
        IF [FFL STATE NAME]<>'UNKNOWN' 
        AND [TIME TO CRIME (YEARS)]>=0 
        THEN [ID] 
        ELSE NULL 
        END
    )
```

### Recoveries Per 100,000 People

This calculation requires a data blend of two data sources in Tableau — firearm recoveries and U.S. Census data. NYAG downloaded United States Census Bureau Annual Estimates of the Resident Population for each New York State county from 2010 through 2015. Population and recovery data is joined where U.S. County Name is equal to the `[RECOVERY_COUNTY]`. For a given year, this field takes the total number of recoveries for a given county divided by the population of that county within that year. If no `[RECOVERY_COUNTY]` is selected, then the population for New York State is used. If no year or multiple years are selected, then the average population of 2010-2015 is used.

```SQL
CASE ATTR([YEAR])
      WHEN '2010' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      WHEN '2011' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      WHEN '2012' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      WHEN '2013' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      WHEN '2014' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      WHEN '2015' 
        THEN (SUM([NUMBER OF RECOVERIES])/[POPULATION].[POPULATION])*100000
      ELSE ((SUM([NUMBER OF RECOVERIES])/COUNTD([YEAR]))/[POPULATION].[POPULATION])*100000
END
```

For the above calculation, the variable `[POPULATION].[POPULATION]` is determined by the following formula:

```SQL
IF ATTR([COUNTY])=ATTR([ATF SUMMARY DATA].[RECOVERY_COUNTY])
    AND TOTAL(SUM([ATF SUMMARY DATA].[NUMBER OF RECOVERIES]))>1
    THEN
        CASE ATTR([ATF SUMMARY DATA].[YEAR]) WHEN 
            '2010' THEN [POP 2010] WHEN
            '2011' THEN [POP 2011] WHEN
            '2012' THEN [POP 2012] WHEN
            '2013' THEN [POP 2013] WHEN
            '2014' THEN [POP 2014] WHEN
            '2015' THEN [POP 2015]
        ELSE
            (POP 2010]/ +
            [POP 2011]/ +
            [POP 2012]/ +
            [POP 2013]/ +
            [POP 2014]/ +
            [POP 2015]/)/6
        END
    ELSE
        (CASE ATTR([ATF SUMMARY DATA].[YEAR]) WHEN
            '2010' THEN 19402920 WHEN
            '2011' THEN 19523202 WHEN
            '2012' THEN 19606981 WHEN
            '2013' THEN 19691032 WHEN
            '2014' THEN 19748858 WHEN
            '2015' THEN 19795791 ELSE 19628131
        END)
END
```

















