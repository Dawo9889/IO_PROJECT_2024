﻿// <auto-generated />
using System;
using Backend.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241105211325_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Domain.Entities.Account", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Image", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Author")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("WeddingId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Wedding", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime>("EventDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Weddings");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Wedding_CEO", b =>
                {
                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AccountId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("WeddingId", "AccountId");

                    b.HasIndex("AccountId");

                    b.ToTable("Wedding_CEOs");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Image", b =>
                {
                    b.HasOne("Backend.Domain.Entities.Wedding", "Wedding")
                        .WithMany("Images")
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Wedding_CEO", b =>
                {
                    b.HasOne("Backend.Domain.Entities.Account", "Account")
                        .WithMany("Wedding_CEOs")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Domain.Entities.Wedding", "Wedding")
                        .WithMany("Wedding_CEOs")
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Account", b =>
                {
                    b.Navigation("Wedding_CEOs");
                });

            modelBuilder.Entity("Backend.Domain.Entities.Wedding", b =>
                {
                    b.Navigation("Images");

                    b.Navigation("Wedding_CEOs");
                });
#pragma warning restore 612, 618
        }
    }
}