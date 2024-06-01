---------------------------------------------REMOVE RETAILER DATA FROM SALES-----------------------------------------------------

CREATE PROCEDURE [ad_wtp_config].[pr_remove_retailer_from_sales](
	@SrceSysId nvarchar(50)
)
WITH EXECUTE AS OWNER
AS
BEGIN
	DECLARE @Tables TABLE (TableName NVARCHAR(128));

	INSERT INTO @TABLES (TableName) VALUES
	('prod_attr_lkp'),
	('prod_lkp'),
	('store_categ_sales_lkp'),
	('store_sales_dev_fct');

	DECLARE @TableName NVARCHAR(128);
	DECLARE @SQL NVARCHAR(MAX);

	DECLARE tableCursor CURSOR FOR
	SELECT TableName FROM @Tables;

	OPEN tableCursor;

	FETCH NEXT FROM tableCursor INTO @TableName;

	WHILE @@FETCH_STATUS = 0
    BEGIN
		BEGIN TRY
			SET @SQL = N'TRUNCATE TABLE [ad_wtp_sales].' + QUOTENAME(@TableName) + 
					   ' WITH (PARTITIONS (SELECT prv.boundary_id + pf.boundary_value_on_right 
											FROM sys.partition_range_values prv 
											INNER JOIN sys.partition_functions pf 
											ON prv.function_id = pf.function_id 
											WHERE prv.value = @SrceSysId
											AND pf.name = ''pfSales'';
										)
								)';

			EXEC sp_executesql @SQL, N'@SrceSysId INT', @SrceSysId;
		END TRY
		BEGIN CATCH
			DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
			RAISERROR('Error occurred during deletion in table %s: %s', 16, 1, @TableName, @ErrorMessage);
		END CATCH

		FETCH NEXT FROM tableCursor INTO @TableName;
    END

	CLOSE tableCursor;
	DEALLOCATE tableCursor;

	
    IF EXISTS (SELECT value 
				FROM sys.partition_range_values 
				WHERE value = @SrceSysId 
				AND function_id = (SELECT function_id FROM sys.partition_functions WHERE name = 'pfSales'))
    BEGIN
        SET @SQL = N'ALTER PARTITION FUNCTION pfSales() MERGE RANGE(' + QUOTENAME(@SrceSysId) + ');';
        EXEC sp_executesql @SQL;
    END
    ELSE
    BEGIN
        RAISERROR('The specified boundary value does not exist in the partition function.', 16, 1);
    END
END
GO

------------------------------------------REMOVE RETAILER FROM CONFIG-----------------------------------------

CREATE PROCEDURE [ad_wtp_config].[pr_remove_retailer](
	@SrceSysId nvarchar(50)
)
AS
BEGIN
	DECLARE @Tables TABLE (TableName NVARCHAR(128));

	INSERT INTO @TABLES (TableName) VALUES
	('srce_sys_lkp'),
	('srce_sys_market_lkp'),
	('srce_sys_owner_lkp');

	DECLARE @TableName NVARCHAR(128);
	DECLARE @SQL NVARCHAR(MAX);

	DECLARE tableCursor CURSOR FOR
	SELECT TableName FROM @Tables;

	OPEN tableCursor;

	FETCH NEXT FROM tableCursor INTO @TableName;

	WHILE @@FETCH_STATUS = 0
    BEGIN
		BEGIN TRY
			SET @SQL = N'DELETE FROM ad_wtp_config.' + QUOTENAME(@TableName) + 
					   ' WHERE srce_sys_id = @SrceSysId'

			EXEC sp_executesql @SQL, N'@SrceSysId INT', @SrceSysId
		END TRY
		BEGIN CATCH
			DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
			RAISERROR('Error occurred during deletion in table %s: %s', 16, 1, @TableName, @ErrorMessage);
		END CATCH

		FETCH NEXT FROM tableCursor INTO @TableName;
    END

	CLOSE tableCursor;
	DEALLOCATE tableCursor;
END
GO

------------------------------------------DEACTIVATE RETAILER---------------------------------------

CREATE PROCEDURE [ad_wtp_config].[pr_deactivate_retailer](
	@SrceSysId nvarchar(50)
)
WITH EXECUTE AS OWNER
AS
BEGIN
	DECLARE @SQL NVARCHAR(MAX), @ErrorMessage NVARCHAR(4000)

	BEGIN TRY
		SET @SQL = N'UPDATE [ad_wtp_config].[srce_sys_market_lkp] SET [is_active] = 0 WHERE srce_sys_id = @SrceSysId'

		EXEC sp_executesql @SQL, N'@SrceSysId INT', @SrceSysId
	END TRY
	BEGIN CATCH
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Error occurred while deactivating srce_sys_id %s in table [ad_wtp_config].[srce_sys_market_lkp]: %s', 16, 1, @SrceSysId, @ErrorMessage);
	END CATCH

	BEGIN TRY
		SET @SQL = N'UPDATE [ad_wtp_config].[srce_sys_owner_lkp] SET [is_active] = 0 WHERE srce_sys_id = @SrceSysId'

		EXEC sp_executesql @SQL, N'@SrceSysId INT', @SrceSysId
	END TRY
	BEGIN CATCH
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Error occurred while deactivating srce_sys_id %s in table [ad_wtp_config].[srce_sys_owner_lkp]: %s', 16, 1, @SrceSysId, @ErrorMessage);
	END CATCH

	BEGIN TRY
		SET @SQL = N'UPDATE [ad_wtp_config].[srce_sys_lkp] SET [is_sales_active] = 0 WHERE srce_sys_id = @SrceSysId'

		EXEC sp_executesql @SQL, N'@SrceSysId INT', @SrceSysId
	END TRY
	BEGIN CATCH
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Error occurred while deactivating srce_sys_id %s in table [ad_wtp_config].[srce_sys_lkp]: %s', 16, 1, @SrceSysId, @ErrorMessage);
	END CATCH
END
GO